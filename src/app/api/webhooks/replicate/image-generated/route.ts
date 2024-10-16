import { NextResponse, NextRequest } from 'next/server';
import { env } from '@/server/env';
import { db } from '@/server/db';
import { validateWebhook } from "replicate";
import { utapi } from "@/server/uploadthing";
import * as Sentry from "@sentry/nextjs";
import { Prediction } from 'replicate';
import { addWatermark } from './watermark';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  const requestClone = request.clone();
  const isValid = validateWebhook(requestClone, env.REPLICATE_WEBHOOK_SECRET);
  if (!isValid) {
    const errorMessage = 'Invalid webhook secret';
    Sentry.captureMessage(errorMessage, 'error');
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage });
  }
  const { searchParams } = new URL(request.url);
  const generatedPhotoId = searchParams.get('generatedPhotoId');
  if (!generatedPhotoId) {
    const errorMessage = 'Missing generatedPhotoId';
    Sentry.captureMessage(errorMessage, 'error');
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage });
  }
  const { status, output } = await request.json() as Prediction;
  if (status !== 'succeeded') {
    const errorMessage = `Expected status: succeeded, found: ${status}`;
    Sentry.captureMessage(errorMessage, 'error');
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage });
  }
  if (!Array.isArray(output) || !output.every(item => typeof item === 'string')) {
    const errorMessage = `Expected output to be an array of strings, found: ${output}`;
    Sentry.captureMessage(errorMessage, 'error');
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage });
  }
  const photoUrl = output[0];
  if (!photoUrl) {
    const errorMessage = 'Missing photoUrl';
    Sentry.captureMessage(errorMessage, 'error');
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage });
  }
  const file = await addWatermark(photoUrl);
  const uploadedFiles = await utapi.uploadFiles([file]);
  const photoUrlWithWatermark = uploadedFiles[0]?.data?.appUrl;
  if (!photoUrlWithWatermark) {
    const errorMessage = `Failed to upload watermarked image: ${uploadedFiles}`;
    Sentry.captureMessage(errorMessage, 'error');
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage });
  }
  const generatedPhoto = await db.generatedPhoto.findFirst({
    where: {
      id: generatedPhotoId,
    },
  });
  if (!generatedPhoto) {
    const errorMessage = 'Generated photo already exists';
    Sentry.captureMessage(errorMessage, 'error');
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage });
  }
  const { id, userId } = generatedPhoto;
  if (env.NODE_ENV === 'test') {
    const response = await fetch(photoUrlWithWatermark);
    const arrayBuffer = await response.arrayBuffer();
    const basePath = 'src/app/api/webhooks/replicate/image-generated'
    const testFileName = 'generated-image.test.webp'
    const expectedImagePath = path.join(process.cwd(), basePath, testFileName)
    await fs.writeFile(expectedImagePath, Buffer.from(arrayBuffer))
    const message = 'Test webhook received.';
    console.log(message);
    return NextResponse.json({ message });
  }
  await db.generatedPhoto.update({
    where: { id },
    data: { photoUrl: photoUrlWithWatermark },
  });
  await db.userSettings.update({
    where: { userId },
    data: {
      credits: {
        decrement: 1,
      },
    }
  });
  return NextResponse.json({ received: true });
}

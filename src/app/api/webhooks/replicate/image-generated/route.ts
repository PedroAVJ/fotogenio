import { NextResponse, NextRequest } from 'next/server';
import { env } from '@/server/env';
import { db } from '@/server/db';
import { validateWebhook } from "replicate";
import sharp from 'sharp';
import { readFile } from 'fs/promises';
import path from 'path';
import { utapi } from "@/server/uploadthing";
import * as Sentry from "@sentry/nextjs";
import { Prediction } from 'replicate';

async function addWatermark(imageUrl: string){
  // Fetch the input image from the provided URL
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  const image = sharp(Buffer.from(imageBuffer));
  
  const metadata = await image.metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;
  
  const watermarkPath = path.join(process.cwd(), 'src/app/api/webhooks/replicate/image-generated', 'watermark.png');
  const watermarkBuffer = await readFile(watermarkPath);
  
  // Load the watermark image
  const watermark = sharp(Buffer.from(watermarkBuffer));
  const watermarkMetadata = await watermark.metadata();
  
  // Resize watermark if it's too large (e.g., max 25% of the main image size)
  const maxWatermarkWidth = Math.floor(width * 0.25);
  const maxWatermarkHeight = Math.floor(height * 0.25);
  
  if ((watermarkMetadata.width || 0) > maxWatermarkWidth || (watermarkMetadata.height || 0) > maxWatermarkHeight) {
    watermark.resize(maxWatermarkWidth, maxWatermarkHeight, { fit: 'inside' });
  }
  
  // Make the watermark semi-transparent
  const transparentWatermark = await watermark
    .composite([{
      input: Buffer.from([255, 255, 255, 128]),
      raw: { width: 1, height: 1, channels: 4 },
      tile: true,
      blend: 'dest-in'
    }])
    .toBuffer();
  
  image
    .composite([
      { input: transparentWatermark, gravity: 'southeast' }
    ])

  // Convert Sharp image to Buffer
  const watermarkedImageBuffer = await image.toBuffer();

  // Create a Blob from the Buffer
  const watermarkedBlob = new Blob([watermarkedImageBuffer], { type: 'image/webp' }); // Adjust the MIME type if necessary

  // Create a File from the Blob
  const file = new File([watermarkedBlob], 'watermarked-image.webp', { type: 'image/webp' });

  // Now you can use the 'file' with utapi.uploadFiles()
  const response = await utapi.uploadFiles([file]);
  const appUrl = response[0]?.data?.appUrl;
  return appUrl;
}

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
  const userId = searchParams.get('userId');
  if (!userId) {
    const errorMessage = 'Missing userId';
    Sentry.captureMessage(errorMessage, 'error');
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage });
  }
  const promptId = searchParams.get('promptId');
  if (!promptId) {
    const errorMessage = 'Missing promptId';
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
  const photoUrlWithWatermark = await addWatermark(photoUrl);
  if (!photoUrlWithWatermark) {
    const errorMessage = 'Failed to add watermark';
    Sentry.captureMessage(errorMessage, 'error');
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage });
  }
  const generatedPhoto = await db.generatedPhoto.findFirst({
    where: {
      userId,
      promptId,
      photoUrl: null,
    },
  });
  if (!generatedPhoto) {
    const errorMessage = 'Generated photo already exists';
    Sentry.captureMessage(errorMessage, 'error');
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage });
  }
  await db.$transaction(async (tx) => {
    await tx.generatedPhoto.update({
      where: { id: generatedPhoto.id },
      data: { photoUrl: photoUrlWithWatermark },
    });
    await tx.userSettings.update({
      where: { userId },
      data: {
        credits: {
          decrement: 1,
        },
      }
    });
  });
  return NextResponse.json({ received: true });
}

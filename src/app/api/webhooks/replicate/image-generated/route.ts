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
    Sentry.captureMessage('Invalid webhook', 'error');
    return NextResponse.json({ received: true }, { status: 200 });
  }
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    Sentry.captureMessage('Missing userId', 'error');
    return NextResponse.json({ received: true }, { status: 200 });
  }
  const promptId = searchParams.get('promptId');
  if (!promptId) {
    Sentry.captureMessage('Missing promptId', 'error');
    return NextResponse.json({ received: true }, { status: 200 });
  }
  const { status, output } = await request.json() as Prediction;
  if (status !== 'succeeded') {
    Sentry.captureMessage(`Fine-tuning failed: Unexpected status '${status}'`, 'error');
    return NextResponse.json({ received: true });
  }
  if (!Array.isArray(output) || !output.every(item => typeof item === 'string')) {
    Sentry.captureMessage('Invalid output format', 'error');
    return NextResponse.json({ received: true });
  }
  const photoUrl = output[0];
  if (!photoUrl) {
    Sentry.captureMessage('Missing photoUrl', 'error');
    return NextResponse.json({ received: true });
  }
  const photoUrlWithWatermark = await addWatermark(photoUrl);
  if (!photoUrlWithWatermark) {
    Sentry.captureMessage('Failed to add watermark', 'error');
    return NextResponse.json({ received: true });
  }
  const generatedPhoto = await db.generatedPhoto.findFirst({
    where: {
      userId,
      promptId,
      photoUrl: null,
    },
  });
  if (!generatedPhoto) {
    Sentry.captureMessage('Generated photo already exists', 'error');
    return NextResponse.json({ received: true });
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

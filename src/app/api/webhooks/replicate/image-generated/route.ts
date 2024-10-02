import { NextResponse, NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { db } from '@/server/db';
import { validateWebhook } from "replicate";
import sharp from 'sharp';
import { readFile } from 'fs/promises';
import path from 'path';
import { utapi } from "@/server/uploadthing";

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
  const url = response[0]?.data?.url;
  return url;
}

export async function POST(request: NextRequest) {
  const requestClone = request.clone();

  const isValid = validateWebhook(requestClone, env.REPLICATE_WEBHOOK_SECRET);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  const promptId = searchParams.get('promptId');
  if (!promptId) {
    return NextResponse.json({ error: 'Missing promptId' }, { status: 400 });
  }
  interface Body {
    output: string[];
    id: string;
  }
  const body = await request.json() as Body;
  const photoUrl = body.output[0];
  if (!photoUrl) {
    return NextResponse.json({ error: 'Missing photoUrl' }, { status: 400 });
  }
  const generatedPhoto = await db.generatedPhoto.findUnique({
    where: { userId_promptId: { userId, promptId } },
  });
  if (generatedPhoto) {
    return NextResponse.json({ error: 'Generated photo already exists' }, { status: 400 });
  }
  const photoUrlWithWatermark = await addWatermark(photoUrl);
  if (!photoUrlWithWatermark) {
    return NextResponse.json({ error: 'Failed to add watermark' }, { status: 500 });
  }
  await db.generatedPhoto.create({
    data: {
      userId,
      promptId,
      photoUrl: photoUrlWithWatermark,
    },
  });
  await db.userSettings.update({
    where: {
      userId,
    },
    data: {
      credits: {
        decrement: 1,
      },
      pendingPhotos: {
        decrement: 1,
      }
    }
  })
  return NextResponse.json({ received: true });
}

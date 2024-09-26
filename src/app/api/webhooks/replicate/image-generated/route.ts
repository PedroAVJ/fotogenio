import { NextResponse, NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { db } from '@/server/db';
import { validateWebhook } from "replicate";
import sharp from 'sharp';
import { put } from '@vercel/blob';

async function addWatermark(imageUrl: string, outputPath: string){
  // Fetch the input image from the provided URL
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  const image = sharp(Buffer.from(imageBuffer));
  
  const metadata = await image.metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;
  
  // Fetch the watermark image from the provided URL using fetch
  const watermarkUrl = 'https://uxsi5qpvaazgwqzm.public.blob.vercel-storage.com/watermark-yhC4mXM1Ov9UUYfCmAJjSqBcHjuYep.png';
  const watermarkResponse = await fetch(watermarkUrl);
  const watermarkBuffer = await watermarkResponse.arrayBuffer();
  
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

  const blob = await put(outputPath, image, { access: 'public' });
  return blob;
}

export async function POST(request: NextRequest) {
  const isValid = validateWebhook(request, env.REPLICATE_WEBHOOK_SECRET);
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
  const folder = `user/generations/${userId}`;
  const blob = await addWatermark(photoUrl, `${folder}/${body.id}`);
  await db.generatedPhoto.create({
    data: {
      userId,
      promptId,
      photoUrl: blob.url,
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

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { env } from '@/lib/env';
import sharp from 'sharp';
import { put } from '@vercel/blob';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  if (env.VERCEL_ENV === 'preview') {
    return `https://${env.VERCEL_BRANCH_URL}`;
  } else if (env.VERCEL_ENV === 'production') {
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  throw new Error('Invalid environment');
}

export async function addWatermark(imageUrl: string, outputPath: string){
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

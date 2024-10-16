import { readFile } from "fs/promises";
import sharp from 'sharp';
import path from 'path';

export async function addWatermark(imageUrl: string){
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
  return file
}

import { readFile } from "fs/promises";
import sharp from 'sharp';
import path from 'path';
import { FileEsque } from "uploadthing/types";

export async function addWatermark(imageUrl: string): Promise<FileEsque> {
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  const image = sharp(Buffer.from(imageBuffer));
  const metadata = await image.metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;
  const watermarkPath = path.join(process.cwd(), 'src/app/api/webhooks/replicate/image-generated', 'watermark.png');
  const watermarkBuffer = await readFile(watermarkPath);
  const watermark = sharp(Buffer.from(watermarkBuffer));
  const watermarkMetadata = await watermark.metadata();
  const maxWatermarkWidth = Math.floor(width * 0.25);
  const maxWatermarkHeight = Math.floor(height * 0.25);
  if ((watermarkMetadata.width || 0) > maxWatermarkWidth || (watermarkMetadata.height || 0) > maxWatermarkHeight) {
    watermark.resize(maxWatermarkWidth, maxWatermarkHeight, { fit: 'inside' });
  }
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
  const watermarkedImageBuffer = await image.toBuffer();
  const watermarkedBlob = new Blob([watermarkedImageBuffer], { type: 'image/webp' });
  const file = new File([watermarkedBlob], 'watermarked-image.webp', { type: 'image/webp' });
  return file;
}

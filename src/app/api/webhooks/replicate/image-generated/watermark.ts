import { readFile } from "fs/promises";
import sharp from 'sharp';
import path from 'path';
import { FileEsque } from "uploadthing/types";

export async function addWatermark(imageUrl: string): Promise<FileEsque> {
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  const image = sharp(imageBuffer);
  const basePath = 'src/app/api/webhooks/replicate/image-generated'
  const watermarkPath = path.join(process.cwd(), basePath , 'watermark.png');
  const watermarkBuffer = await readFile(watermarkPath);
  const watermark = sharp(watermarkBuffer);
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
  return new File([watermarkedImageBuffer], 'watermarked-image.webp', { type: 'image/webp' });
}

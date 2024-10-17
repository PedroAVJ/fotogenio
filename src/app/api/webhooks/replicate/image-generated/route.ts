import { NextResponse, NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { db, utapi } from '@/server/clients';
import { validateWebhook } from "replicate";
import { Prediction } from 'replicate';
import { addWatermark } from './watermark';

export async function POST(request: NextRequest) {
  const requestClone = request.clone();
  const isValid = await validateWebhook(requestClone, env.REPLICATE_WEBHOOK_SECRET);
  if (!isValid) {
    throw new Error('Invalid webhook secret');
  }
  const { searchParams } = new URL(request.url);
  const generatedPhotoId = searchParams.get('generatedPhotoId') ?? '';
  const { output } = await request.json() as Prediction;
  const generatedPhotoUrl = output[0] as string;
  const file = await addWatermark(generatedPhotoUrl);
  const uploadedFiles = await utapi.uploadFiles([file]);
  const photoUrlWithWatermark = uploadedFiles[0]?.data?.appUrl ?? '';
  const { id, userId, photoUrl } = await db.generatedPhoto.findUniqueOrThrow({
    where: {
      id: generatedPhotoId,
    },
  });
  if (photoUrl) {
    return NextResponse.json({ message: 'Webhook retry catched' });
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
  return NextResponse.json({ message: 'Webhook received' });
}

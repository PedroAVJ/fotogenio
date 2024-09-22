import { NextResponse, NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { db } from '@/server/db';
import { validateWebhook } from "replicate";
import { put } from '@vercel/blob';

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
  await db.generatedPhoto.findUniqueOrThrow({
    where: { userId_promptId: { userId, promptId } },
  });
  interface Body {
    output: string[];
    id: string;
  }
  const body = await request.json() as Body;
  const photoUrl = body.output[0];
  if (!photoUrl) {
    return NextResponse.json({ error: 'Missing photoUrl' }, { status: 400 });
  }
  const imageResponse = await fetch(photoUrl);
  if (!imageResponse.ok) {
    return NextResponse.json({ error: 'Failed to download image' }, { status: 500 });
  }
  const imageBuffer = await imageResponse.arrayBuffer();
  const folder = `user/generations/${userId}`;
  const blob = await put(`${folder}/${body.id}`, imageBuffer, { access: 'public' });
  await db.generatedPhoto.update({
    where: { userId_promptId: { userId, promptId } },
    data: { photoUrl: blob.url },
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

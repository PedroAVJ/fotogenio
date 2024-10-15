import { NextResponse, NextRequest } from 'next/server';
import { env } from '@/server/env';
import { db } from '@/server/db';
import { Training } from 'replicate';
import { validateWebhook } from "replicate";
import * as Sentry from "@sentry/nextjs";
import { generateImages } from './generate-images';

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
  const { status } = await request.json() as Training;
  if (status !== 'succeeded') {
    const errorMessage = `Fine-tuning failed: Unexpected status '${status}'`;
    Sentry.captureMessage(errorMessage, 'error');
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage });
  }
  const userSettings = await db.userSettings.findUnique({
    where: { userId },
  });
  if (!userSettings) {
    const errorMessage = `User settings for user id ${userId} not found`;
    Sentry.captureMessage(errorMessage, 'error');
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage });
  }
  if (userSettings.modelStatus !== 'training') {
    const errorMessage = `Expected model status: training, found: ${userSettings.modelStatus} for user id ${userId}`;
    Sentry.captureMessage(errorMessage, 'error');
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage });
  }
  const prompts = await db.prompt.findMany({
    where: {
      style: {
        chosenStyles: {
          some: {
            userId,
          },
        },
      },
    },
    include: {
      style: {
        include: {
          chosenStyles: true,
        },
      },
    },
  });
  await db.$transaction(async (tx) => {
    await tx.userSettings.update({
      where: { userId },
      data: { modelStatus: 'ready' },
    });
    await tx.generatedPhoto.createMany({
      data: prompts.map(({ id }) => ({ userId, promptId: id })),
    });
  });
  await generateImages({
    userId,
    prompts,
  })
  return NextResponse.json({ message: 'Webhook received' });
}

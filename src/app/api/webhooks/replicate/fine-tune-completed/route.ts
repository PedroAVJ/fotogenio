import { NextResponse, NextRequest } from 'next/server';
import { env } from '@/server/env';
import { db } from '@/server/db';
import { replicate } from '@/server/replicate';
import { Training } from 'replicate';
import { validateWebhook } from "replicate";
import { webhookBaseUrl } from '@/server/urls';
import md5 from 'md5';
import * as Sentry from "@sentry/nextjs";

export async function POST(request: NextRequest) {
  const requestClone = request.clone();
  const isValid = validateWebhook(requestClone, env.REPLICATE_WEBHOOK_SECRET);
  if (!isValid) {
    Sentry.captureMessage('Invalid webhook', 'error');
    return NextResponse.json({ received: true });
  }
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    Sentry.captureMessage('Missing userId', 'error');
    return NextResponse.json({ received: true });
  }
  const { status } = await request.json() as Training;
  if (status !== 'succeeded') {
    Sentry.captureMessage(`Fine-tuning failed: Unexpected status '${status}'`, 'error');
    return NextResponse.json({ received: true });
  }
  const userSettings = await db.userSettings.findUnique({
    where: { userId, modelStatus: 'training' },
  });
  if (!userSettings) {
    Sentry.captureMessage('Webhook has already been received', 'error');
    return NextResponse.json({ received: true });
  }
  const modelName = `flux-${md5(userId)}`;
  const model = await replicate.models.get('pedroavj', modelName);
  const version = model.latest_version;
  if (!version) {
    Sentry.captureMessage('Version not found', 'error');
    return NextResponse.json({ received: true });
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
  await Promise.all(prompts.map(async ({ id, prompt }) => {
    const webhookUrl = `${webhookBaseUrl}/replicate/image-generated?userId=${userId}&promptId=${id}`;
    await replicate.predictions.create(
      {
        model: `pedroavj/${modelName}`,
        version: version.id,
        webhook: webhookUrl,
        webhook_events_filter: ['completed'],
        input: {
          prompt,
          num_inference_steps: 50,
          output_quality: 100,
        }
      }
    );
  }));
  return NextResponse.json({ received: true });
}

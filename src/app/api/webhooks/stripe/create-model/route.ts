import { NextResponse, NextRequest } from 'next/server';
import { stripe } from '@/server/stripe';
import { env } from '@/lib/env';
import { headers } from 'next/headers';
import { db } from '@/server/db';
import { replicate } from '@/server/replicate';
import { getBaseUrl } from '@/lib/utils';
import md5 from 'md5';
import * as Sentry from '@sentry/nextjs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');
  if (!signature) {
    Sentry.captureMessage('Missing stripe-signature', 'error');
    return NextResponse.json({ received: true });
  }
  const event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  if (event.type !== 'payment_intent.succeeded') {
    Sentry.captureMessage('Invalid event type', 'error');
    return NextResponse.json({ received: true });
  }
  const paymentIntent = event.data.object;
  const userId = paymentIntent.metadata['userId'];
  if (!userId) {
    Sentry.captureMessage('Missing userId', 'error');
    return NextResponse.json({ received: true });
  }
  const userSettings = await db.userSettings.findUnique({
    where: { userId, modelStatus: 'pending' },
  });
  if (!userSettings) {
    Sentry.captureMessage('Model is already training', 'error');
    return NextResponse.json({ received: true });
  }
  await db.$transaction(async (tx) => {
    await tx.userSettings.update({
      where: { userId },
      data: { credits: { increment: 25 }, modelStatus: 'training' },
    });
    const modelName = `flux-${md5(userId)}`;
    const model = await replicate.models.create(
      'pedroavj',
      modelName,
      {
        visibility: 'private',
        hardware: 'gpu-t4'
      }
    )
    const baseUrl = getBaseUrl();
    const webhookUrl = new URL(`${baseUrl}/api/webhooks/replicate/fine-tune-completed`);
    webhookUrl.searchParams.set('userId', userId);
    await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "885394e6a31c6f349dd4f9e6e7ffbabd8d9840ab2559ab78aed6b2451ab2cfef",
      {
        destination: `${model.owner}/${model.name}`,
        webhook: webhookUrl.toString(),
        webhook_events_filter: ['completed'],
        input: {
          steps: 1000,
          lora_rank: 16,
          optimizer: "adamw8bit",
          batch_size: 1,
          resolution: "512,768,1024",
          autocaption: true,
          input_images: userSettings.zippedPhotosUrl,
          trigger_word: "TOK",
          learning_rate: 0.0004,
          wandb_project: "flux_train_replicate",
          wandb_save_interval: 100,
          caption_dropout_rate: 0.05,
          cache_latents_to_disk: false,
          wandb_sample_interval: 100
        }
      }
    );
  });
  return NextResponse.json({ received: true });
}

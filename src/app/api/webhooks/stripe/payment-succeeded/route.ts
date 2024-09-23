import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';
import { env } from '@/lib/env';
import { headers } from 'next/headers';
import { db } from '@/server/db';
import { replicate } from '@/server/replicate';
import { getBaseUrl } from '@/lib/utils';
import md5 from 'md5';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  });
  const event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  if (event.type !== 'payment_intent.succeeded') {
    return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
  }
  const paymentIntent = event.data.object;
  const userId = paymentIntent.metadata['userId'];
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  const operation = paymentIntent.metadata['operation'];
  if (!operation) {
    return NextResponse.json({ error: 'Missing operation' }, { status: 400 });
  }
  const { zippedPhotosUrl } = await db.userSettings.findUniqueOrThrow({
    where: { userId, modelStatus: 'pending' },
    select: { zippedPhotosUrl: true },
  });
  if (operation === 'create-model') {
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
    await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "885394e6a31c6f349dd4f9e6e7ffbabd8d9840ab2559ab78aed6b2451ab2cfef",
      {
        destination: `${model.owner}/${model.name}`,
        webhook: `${baseUrl}/api/webhooks/replicate/fine-tune-completed?userId=${userId}`,
        webhook_events_filter: ['completed'],
        input: {
          steps: 1000,
          lora_rank: 16,
          optimizer: "adamw8bit",
          batch_size: 1,
          resolution: "512,768,1024",
          autocaption: true,
          input_images: zippedPhotosUrl,
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
    await db.userSettings.update({
      where: { userId },
      data: { credits: { increment: 25 }, modelStatus: 'training' },
    });
  } else if (operation === 'buy-credits') {
    await db.userSettings.update({
      where: { userId },
      data: { credits: { increment: 25 } },
    });
  }
  return NextResponse.json({ received: true });
}

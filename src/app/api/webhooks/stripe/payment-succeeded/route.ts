import { NextResponse, NextRequest } from 'next/server';
import { stripe } from '@/server/stripe';
import { env } from '@/server/env';
import { headers } from 'next/headers';
import { db } from '@/server/db';
import { replicate } from '@/server/replicate';
import { webhookBaseUrl } from '@/server/urls';
import md5 from 'md5';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');
  const event = stripe.webhooks.constructEvent(
    body,
    signature ?? '',
    env.STRIPE_WEBHOOK_SECRET
  ) as Stripe.PaymentIntentSucceededEvent;
  const { userId = '', operation } = event.data.object.metadata;
  if (env.NODE_ENV === 'test') {
    const message = 'Test webhook received';
    console.log(message);
    return NextResponse.json({ message });
  }
  if (operation === 'create-model') {
    const userSettings = await db.userSettings.findUnique({
      where: {
        userId,
        modelStatus: 'pending'
      },
    });
    if (!userSettings) {
      return NextResponse.json({ message: 'Webhook retry catched' });
    }
    await db.userSettings.update({
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
    const webhookUrl = `${webhookBaseUrl}/replicate/fine-tune-completed?userId=${userId}`;
    await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "885394e6a31c6f349dd4f9e6e7ffbabd8d9840ab2559ab78aed6b2451ab2cfef",
      {
        destination: `${model.owner}/${model.name}`,
        webhook: webhookUrl,
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
  } else if (operation === 'buy-credits') {
    await db.userSettings.update({
      where: { userId },
      data: { credits: { increment: 25 } },
    });
  }
  return NextResponse.json({ message: 'Webhook received' });
}

import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';
import { env } from '@/server/env';
import { headers } from 'next/headers';
import { ratelimit } from '@/server/ratelimit';
import { db } from '@/server/db';
import { replicate } from '@/server/replicate';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const ipAddress = request.ip ?? 'Unknown IP';
  const { success } = await ratelimit.limit(ipAddress);
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const body = await request.text();
  const signature = headers().get('stripe-signature') ?? '';
  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  if (event.type !== 'payment_intent.succeeded') {
    return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
  }
  const paymentIntent = event.data.object;
  const userId = paymentIntent.metadata['userId'] ?? '';
  const operation = paymentIntent.metadata['operation'] ?? '';
  /* await db.userSettings.update({
    where: { userId },
    data: { credits: { increment: 25 } },
  });
  if (operation === 'create-model') {
    const modelName = `flux-${userId}`;
    const model = await replicate.models.create(
      env.REPLICATE_OWNER,
      modelName,
      {
        visibility: 'private',
        hardware: 'gpu-t4'
      }
    )
    const zippedPhotosUrl = await db.userSettings.findUnique({
      where: { userId },
      select: { zippedPhotosUrl: true },
    });
    const baseUrl = env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
      : `http://${env.WEBHOOK_MOCK_URL}`;
    await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "885394e6a31c6f349dd4f9e6e7ffbabd8d9840ab2559ab78aed6b2451ab2cfef",
      {
        destination: `${model.owner}/${model.name}`,
        webhook: `${baseUrl}/api/webhooks/replicate/fine-tune-completed`,
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
  } */
  return NextResponse.json({ received: true });
}

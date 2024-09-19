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
  await db.userSettings.update({
    where: { userId },
    data: { credits: { increment: 25 } },
  });
  if (operation === 'create-model') {
    
  }
  return NextResponse.json({ received: true });
}

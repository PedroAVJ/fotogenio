import { NextResponse, NextRequest } from 'next/server';
import { stripe } from '@/server/stripe';
import { env } from '@/lib/env';
import { headers } from 'next/headers';
import { db } from '@/server/db';
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
  await db.userSettings.update({
    where: { userId },
    data: { credits: { increment: 25 } },
  });
  return NextResponse.json({ received: true });
}

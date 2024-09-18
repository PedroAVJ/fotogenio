import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { env } from '@/server/env';
import { headers } from 'next/headers';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Handle successful payment
      await handlePaymentSucceeded(session);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 500 });
  }
}

async function handlePaymentSucceeded(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.['userId'];
  const operation = session.metadata?.['operation'] ?? '';

  if (!userId) {
    console.error('User ID not found in session metadata');
    return;
  }

  // TODO: Implement your logic here, such as:
  // - Updating user's subscription status in your database
  // - Granting access to paid features
  // - Sending a confirmation email
  console.log(`Payment succeeded for user ${userId} with operation ${operation}`);
}

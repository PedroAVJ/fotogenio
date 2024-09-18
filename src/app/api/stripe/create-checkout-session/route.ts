import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';
import { env } from '@/server/env';
import { auth } from '@clerk/nextjs/server';
import { ratelimit } from '@/server/ratelimit';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  const { userId } = auth().protect();
  const { success } = await ratelimit.limit(userId);
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const { url } = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: 'price_1Q0ChaBgMxTXAhq1FZsBAkwX',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${request.headers.get('origin')}/wait`,
    cancel_url: `${request.headers.get('origin')}/generar-imagenes`,
    metadata: {
      userId: userId,
      operation: 'create-model',
    },
  });
  if (!url) {
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
  return NextResponse.redirect(url, 303);
}

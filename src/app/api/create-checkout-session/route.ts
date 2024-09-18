import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { env } from '@/server/env';

// Initialize Stripe
const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20', // Use the latest API version
});

export async function POST(request: Request) {
  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 'price_1Q0ChaBgMxTXAhq1FZsBAkwX',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/wait`,
      cancel_url: `${request.headers.get('origin')}/generar-imagenes`,
    });

    // Redirect to the Stripe session URL
    return NextResponse.redirect(session.url!, 303);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}
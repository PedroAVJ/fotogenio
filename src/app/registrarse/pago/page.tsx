import { stripe } from '@/server/stripe';
import { env } from '@/server/env';
import { baseUrl } from '@/server/urls';
import { auth } from '@clerk/nextjs/server';
import { ChoosePaymentComponent } from './choose-payment';
import * as Sentry from '@sentry/nextjs';

export default async function Page() {
  const { userId } = auth().protect();
  const { client_secret } = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        price: env.CREDITS_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: 'payment',
    return_url: `${baseUrl}/generando-fotos?session_id={CHECKOUT_SESSION_ID}`,
    payment_intent_data: {
      metadata: {
        userId,
        operation: 'create-model',
      },
    },
    locale: 'es'
  });
  if (!client_secret) {
    Sentry.captureMessage('No client secret', 'error');
  }
  return <ChoosePaymentComponent clientSecret={client_secret} />
}

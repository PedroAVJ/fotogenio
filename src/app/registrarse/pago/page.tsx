import { stripe } from '@/server/stripe';
import { env } from '@/server/env';
import { baseUrl } from '@/server/urls';
import { auth } from '@clerk/nextjs/server';
import { ChoosePaymentComponent } from '@/app/choose-payment';
import * as Sentry from '@sentry/nextjs';
import { clerkClient } from '@clerk/nextjs/server';

export default async function Page() {
  const { userId } = auth().protect();
  const user = await clerkClient().users.getUser(userId);
  const returnUrl = `${baseUrl}/generando-fotos?session_id={CHECKOUT_SESSION_ID}`;
  const { client_secret } = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    customer_email: user.emailAddresses[0]?.emailAddress ?? '',
    line_items: [
      {
        price: env.CREDITS_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: 'payment',
    return_url: returnUrl,
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

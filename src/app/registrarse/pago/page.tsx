import { stripe } from '@/server/stripe';
import { env } from '@/lib/env';
import { baseUrl } from '@/server/urls';
import { auth } from '@clerk/nextjs/server';
import { ChoosePaymentComponent } from '@/app/choose-payment';
import * as Sentry from '@sentry/nextjs';
import { clerkClient } from '@clerk/nextjs/server';
import { db } from '@/server/db';
import { searchParamsCache } from './searchParams'
import { Gender } from '@prisma/client'

export default async function Page({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const { gender, styles, zippedPhotosUrl } = searchParamsCache.parse(searchParams)
  console.log(gender, styles, zippedPhotosUrl)
  const { userId } = auth().protect();
  const userSettings = await db.userSettings.findUnique({
    where: { userId }
  });
  if (!userSettings) {
    await db.userSettings.create({
      data: {
        userId,
        gender: gender ?? Gender.male,
        zippedPhotosUrl: zippedPhotosUrl ?? '',
        credits: 0,
        modelStatus: 'pending',
      },
    });
    await db.chosenStyle.createMany({
      data: styles.map((style) => ({
        userId,
        styleId: style,
      })),
    });
  }
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

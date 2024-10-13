'use server';

import { api } from "@/server/trpc";
import { stripe } from '@/server/stripe';
import { env } from '@/server/env';
import { redirect } from 'next/navigation';
import { getBaseUrl } from "@/lib/utils";

export const procederAPago = api
  .mutation(async ({ ctx: { session: { userId } } }) => {
    const baseUrl = getBaseUrl();
    const { url } = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: env.CREDITS_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${baseUrl}/generando-fotos`,
      payment_intent_data: {
        metadata: {
          userId,
        },
      },
      locale: 'es'
    });
    if (!url) {
      return { message: 'Hubo un error al crear la sesión de pago' }
    }
    redirect(url);
  });

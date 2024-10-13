'use server';

import { api } from "@/server/trpc";
import { stripe } from '@/server/stripe';
import { env } from '@/lib/env';
import { redirect } from 'next/navigation';
import { getBaseUrl } from "@/lib/utils";

export const createCheckoutSessionAction = api
  .mutation(async ({ ctx: { session: { userId } } }) => {
    const baseUrl = getBaseUrl();
    const { url } = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: env.CREDITS_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/generando-fotos`,
      cancel_url: `${baseUrl}/generar-imagenes`,
      payment_intent_data: {
        metadata: {
          userId,
          operation: 'create-model',
        },
      },
      locale: 'es'
    });
    if (!url) {
      return { message: 'Hubo un error al crear la sesión de pago' }
    }
    redirect(url);
  });

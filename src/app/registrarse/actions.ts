'use server';

import { api } from "@/server/trpc";
import { db } from "@/server/db";
import { z } from "zod";
import { Gender } from "@prisma/client";
import Stripe from 'stripe';
import { env } from '@/lib/env';
import { redirect } from 'next/navigation';
import { getBaseUrl } from "@/lib/utils";

export const addPhotosToDb = api
  .input(z.object({
    photoUrls: z.array(z.string().url()).min(1).max(20),
    zippedPhotosUrl: z.string().url(),
  }))
  .mutation(async ({ input: { photoUrls, zippedPhotosUrl }, ctx: { session: { userId } } }) => {
    await db.uploadedPhoto.createMany({
      data: photoUrls.map((photoUrl) => ({
        photoUrl,
        userId,
      })),
    });
    await db.userSettings.update({
      where: { userId },
      data: { zippedPhotosUrl },
    });
  });

const addUserSettings = z.object({
  gender: z.nativeEnum(Gender),
  styleIds: z.array(z.string()),
});

export const addUserSettingsAction = api
  .input(addUserSettings)
  .mutation(async ({ input: { gender, styleIds }, ctx: { session: { userId } } }) => {
    await db.chosenStyle.createMany({
      data: styleIds.map((styleId) => ({
        userId,
        styleId,
      })),
    });
    await db.userSettings.create({
      data: {
        userId,
        gender,
        credits: 0,
        pendingPhotos: 0,
        modelStatus: 'pending',
      },
    });
  });

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

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

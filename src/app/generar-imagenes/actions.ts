'use server';

import { api } from "@/server/trpc";
import { zfd } from "zod-form-data";
import { db } from "@/server/db";
import { put } from "@vercel/blob";
import { z } from "zod";
import { Gender } from "@prisma/client";
import Stripe from 'stripe';
import { env } from '@/server/env';
import { TRPCError } from '@trpc/server';
import { redirect } from 'next/navigation';

const uploadPhotos = zfd.formData({
  photos: zfd.repeatableOfType(zfd.file())
});

export const uploadPhotosAction = api
  .input(uploadPhotos)
  .mutation(async ({ input: { photos }, ctx: { session: { userId } } }) => {
    await Promise.all(photos.map(async (photo) => {
      const path = `user/uploads/${photo.name}`
      const blob = await put(path, photo, {
        access: "public",
      })
      await db.uploadedPhoto.create({
        data: {
          photoUrl: blob.url,
          userId,
        }
      })
    }))
  });

const addUserSettings = z.object({
  gender: z.nativeEnum(Gender),
  styleIds: z.array(z.string()),
});

export const addUserSettingsAction = api
  .input(addUserSettings)
  .mutation(async ({ input: { gender, styleIds }, ctx: { session: { userId } } }) => {
    await db.userSettings.create({
      data: {
        userId,
        gender,
        credits: 25,
        pendingPhotos: 0,
      },
    });
    await db.chosenStyle.createMany({
      data: styleIds.map((styleId) => ({
        userId,
        styleId,
      })),
    });
  });

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export const createCheckoutSessionAction = api
  .mutation(async ({ ctx: { session: { userId } } }) => {
    const baseUrl = env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
      : `http://localhost:3000`;
    const { url } = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1Q0ChaBgMxTXAhq1FZsBAkwX',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/wait`,
      cancel_url: `${baseUrl}/generar-imagenes`,
      metadata: {
        userId: userId,
        operation: 'create-model',
      },
    });
    if (!url) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create checkout session',
      });
    }
    redirect(url);
  });

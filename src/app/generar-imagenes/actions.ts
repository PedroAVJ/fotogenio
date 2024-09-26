'use server';

import { api } from "@/server/trpc";
import { zfd } from "zod-form-data";
import { db } from "@/server/db";
import { put } from "@vercel/blob";
import { z } from "zod";
import { Gender } from "@prisma/client";
import Stripe from 'stripe';
import { env } from '@/lib/env';
import { redirect } from 'next/navigation';
import JSZip from 'jszip';
import { getBaseUrl } from "@/lib/utils";

const uploadPhotos = zfd.formData({
  photos: zfd.repeatableOfType(zfd.file())
});

export const uploadPhotosAction = api
  .input(uploadPhotos)
  .mutation(async ({ input: { photos }, ctx: { session: { userId } } }) => {
    const zip = new JSZip();
    await Promise.all(photos.map(async (photo) => {
      const arrayBuffer = await photo.arrayBuffer();
      zip.file(photo.name, arrayBuffer);
    }));
    const zipContent = await zip.generateAsync({ type: 'blob' });
    await Promise.all(photos.map(async (photo) => {
      const path = `user/uploads/${userId}/${photo.name}`
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
    const zipPath = `user/uploads/${userId}/all_photos.zip`;
    const zipBlob = await put(zipPath, zipContent, {
      access: "public",
    });
    await db.userSettings.update({
      where: { userId },
      data: { zippedPhotosUrl: zipBlob.url },
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
      success_url: `${baseUrl}/waiting`,
      cancel_url: `${baseUrl}/generar-imagenes`,
      payment_intent_data: {
        metadata: {
          userId,
          operation: 'create-model',
        },
      },
    });
    if (!url) {
      return { message: 'Hubo un error al crear la sesión de pago' }
    }
    redirect(url);
  });

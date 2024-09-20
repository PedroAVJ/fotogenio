'use server';

import { api } from "@/server/trpc";
import { zfd } from "zod-form-data";
import { db } from "@/server/db";
import { put } from "@vercel/blob";
import { z } from "zod";
import { Gender } from "@prisma/client";
import Stripe from 'stripe';
import { env } from '@/lib/env';
import { TRPCError } from '@trpc/server';
import { redirect } from 'next/navigation';
import JSZip from 'jszip';

const uploadPhotos = zfd.formData({
  photos: zfd.repeatableOfType(zfd.file())
});

export const uploadPhotosAction = api
  .input(uploadPhotos)
  .mutation(async ({ input: { photos }, ctx: { session: { userId } } }) => {
    const zip = new JSZip();
    photos.forEach((photo) => {
      zip.file(photo.name, photo);
    });
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
    const prompts = await db.prompt.findMany({
      include: {
        style: {
          include: {
            chosenStyles: {
              where: {
                userId,
              },
            },
          },
        },
      },
    });
    await db.userSettings.create({
      data: {
        userId,
        gender,
        credits: 25,
        pendingPhotos: prompts.length,
        modelStatus: 'pending',
      },
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

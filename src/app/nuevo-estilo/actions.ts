'use server';

import { api } from "@/server/trpc";
import { db } from "@/server/db";
import { z } from "zod";
import Stripe from 'stripe';
import { env } from '@/lib/env';
import { redirect } from 'next/navigation';
import { replicate } from "@/server/replicate";
import { getBaseUrl } from "@/lib/utils";

const addUserSettings = z.object({
  styleIds: z.array(z.string()),
});

export const createImages = api
  .input(addUserSettings)
  .mutation(async ({ input: { styleIds }, ctx: { session: { userId } } }) => {
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
    const filteredPrompts = prompts.filter(prompt => 
      styleIds.includes(prompt.style.id)
    );
    await db.userSettings.update({
      where: { userId },
      data: {
        pendingPhotos: filteredPrompts.length,
      },
    });
    const modelName = `flux-${userId}`;
    const baseUrl = getBaseUrl();
    const model = await replicate.models.get('pedroavj', modelName);
    const version = model.latest_version;
    if (!version) {
      return { message: 'La ultima versión del modelo no se encuentro' }
    }
    await Promise.all(filteredPrompts.map(async (prompt) => {
      await replicate.run(
        `pedroavj/${modelName}:${version.id}`,
        {
          webhook: `${baseUrl}/api/webhooks/replicate/image-generated?userId=${userId}&promptId=${prompt.id}`,
          webhook_events_filter: ['completed'],
          input: {
            prompt: prompt.prompt,
            image: prompt.inpaintPhotoUrl,
            model: "dev",
            lora_scale: 1,
            num_outputs: 1,
            aspect_ratio: "1:1",
            output_format: "webp",
            guidance_scale: 3.5,
            output_quality: 90,
            prompt_strength: 0.8,
            extra_lora_scale: 1,
            num_inference_steps: 28
          }
        }
      );
    }))
    redirect('/generando-fotos')
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
      success_url: `${baseUrl}/nuevo-estilo`,
      cancel_url: `${baseUrl}/nuevo-estilo`,
      payment_intent_data: {
        metadata: {
          userId,
          operation: 'buy-credits',
        },
      },
    });
    if (!url) {
      return { message: 'Hubo un error al crear la sesión de pago' }
    }
    redirect(url);
  });
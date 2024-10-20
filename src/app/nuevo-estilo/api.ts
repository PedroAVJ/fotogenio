'use server';

import { api, db } from "@/lib/clients";
import { z } from "zod";
import { redirect } from 'next/navigation';
import { generateImages } from "@/app/generate-images";
import { Route } from "next";

const addUserSettings = z.object({
  styleIds: z.array(z.string()),
});

export const createImages = api
  .input(addUserSettings)
  .mutation(async ({ input: { styleIds }, ctx: { session: { userId } } }) => {
    const { credits } = await db.userSettings.findUniqueOrThrow({
      where: { userId }
    });
    if (credits < styleIds.length) {
      throw new Error('Not enough credits');
    }
    const prompts = await db.prompt.findMany({
      where: {
        style: {
          id: {
            in: styleIds,
          },
        },
      },
    });
    await generateImages({ userId, prompts });
    const url: Route = '/generando-fotos';
    redirect(url);
  });

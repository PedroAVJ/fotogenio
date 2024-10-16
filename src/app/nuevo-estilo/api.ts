'use server';

import { api } from "@/server/trpc";
import { db } from "@/server/db";
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

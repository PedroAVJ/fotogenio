'use server';

import { api } from "@/server/trpc";
import { db } from "@/server/db";
import { z } from "zod";
import { Gender } from "@prisma/client";
import { redirect } from "next/navigation";

const createUserSchema = z.object({
  gender: z.nativeEnum(Gender),
  styleIds: z.array(z.string()),
  zippedPhotosUrl: z.string()
});

export const createUser = api
  .input(createUserSchema)
  .mutation(async ({ input: { gender, styleIds, zippedPhotosUrl }, ctx: { session: { userId } } }) => {
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
        zippedPhotosUrl,
        credits: 0,
        modelStatus: 'pending',
      },
    });
    redirect('/registrarse/pago')
  });

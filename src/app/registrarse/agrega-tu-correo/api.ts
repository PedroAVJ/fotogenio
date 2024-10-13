'use server';

import { api } from "@/server/trpc";
import { db } from "@/server/db";
import { z } from "zod";
import { Gender } from "@prisma/client";

const createUserSchema = z.object({
  gender: z.nativeEnum(Gender),
  styleIds: z.array(z.string()),
});

export const createUser = api
  .input(createUserSchema)
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

'use server';

import { api, db } from "@/server/clients";
import { z } from "zod";
import { Feedback } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { Route } from "next";

const feedback = z.object({
  feedback: z.nativeEnum(Feedback),
  generatedPhotoId: z.string(),
});

export const saveFeedback = api
  .input(feedback)
  .mutation(async ({ input: { feedback, generatedPhotoId }, ctx: { session: { userId } } }) => {
    await db.generatedPhoto.update({
      where: {
        id: generatedPhotoId,
        userId,
      },
      data: {
        feedback,
      }
    })
    const path: Route = '/galeria'
    revalidatePath(path)
  });

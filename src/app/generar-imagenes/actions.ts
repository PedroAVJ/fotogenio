'use server';

import { api } from "@/server/trpc";
import { zfd } from "zod-form-data";
import { db } from "@/server/db";
import { put } from "@vercel/blob";
import { auth } from '@clerk/nextjs/server';
import { z } from "zod";
import { Gender } from "@prisma/client";

const uploadPhotos = zfd.formData({
  photos: zfd.repeatableOfType(zfd.file())
});

export const uploadPhotosAction = api
  .input(uploadPhotos)
  .mutation(async ({ input: { photos } }) => {
    const folder = 'user/uploads'
    const uploadedPhotos = await Promise.all(photos.map(
      async (photo) => {
        const path = `${folder}/${photo.name}`
        const blob = await put(path, photo, {
          access: "public",
        })
        return blob;
      }
    ))
    const { userId } = auth().protect();
    await Promise.all(uploadedPhotos.map(
      async (photo) => {
        await db.uploadedPhoto.create({
          data: {
            photoUrl: photo.url,
            userId,
          }
        })
      }
    ))
  });

const addUserSettings = z.object({
  gender: z.nativeEnum(Gender),
  styleIds: z.array(z.string()),
});

export const addUserSettingsAction = api
  .input(addUserSettings)
  .mutation(async ({ input: { gender, styleIds } }) => {
    const { userId } = auth().protect();
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

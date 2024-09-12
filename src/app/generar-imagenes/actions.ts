'use server';

import { api } from "@/server/trpc";
import { zfd } from "zod-form-data";
import { db } from "@/server/db";
import { put } from "@vercel/blob";
import { auth } from '@clerk/nextjs/server';

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

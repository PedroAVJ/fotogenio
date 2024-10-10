import { createUploadthing, type FileRouter as UploadThingFileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";

const f = createUploadthing();

export const fileRouter = {
  subirFotos: f({ image: { maxFileSize: "8MB", maxFileCount: 20 } })
    .middleware(async () => {
      auth().protect();
      return {};
    })
    .onUploadComplete(async () => {
      return {};
    }),
  subirZip: f({ "application/zip": { maxFileSize: "256MB", maxFileCount: 1 } })
    .middleware(async () => {
      const { userId } = auth().protect();
      return { userId };
    })
    .onUploadComplete(async ({ metadata: { userId }, file }) => {
      await db.userSettings.update({
        where: { userId },
        data: { zippedPhotosUrl: file.appUrl },
      });
      return {};
    }),
} satisfies UploadThingFileRouter;

export type FileRouter = typeof fileRouter;

import { createUploadthing, type FileRouter as UploadThingFileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const fileRouter = {
  subirFotos: f({ image: { maxFileSize: "8MB", maxFileCount: 2 } })
    .middleware(async () => {
      auth().protect();
      return {};
    })
    .onUploadComplete(async () => {
      return {};
    }),
} satisfies UploadThingFileRouter;

export type FileRouter = typeof fileRouter;

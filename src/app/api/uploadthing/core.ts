import { createUploadthing, type FileRouter as UploadThingFileRouter } from "uploadthing/next";

const f = createUploadthing();

export const fileRouter = {
  subirZip: f({ "application/zip": { maxFileSize: "256MB", maxFileCount: 1 } })
    .onUploadComplete(async () => {
      return {};
    }),
} satisfies UploadThingFileRouter;

export type FileRouter = typeof fileRouter;

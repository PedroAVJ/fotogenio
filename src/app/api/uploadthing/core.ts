import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 2 } })
    .middleware(async () => {
      // auth().protect();
      return {};
    })
    .onUploadComplete(async () => {
      return {};
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

import {
  createUploadthing,
  type FileRouter as UploadThingFileRouter,
} from "uploadthing/next";
import { captionImage } from "./caption-image";

const f = createUploadthing();

export const fileRouter = {
  subirZip: f({
    "application/zip": { maxFileSize: "256MB", maxFileCount: 1 },
  })
    .onUploadError(({ error }) => {
      console.error(error);
    })
    .onUploadComplete(() => {
      return {};
    }),
  subirFotos: f(
    {
      image: { maxFileSize: "8MB", maxFileCount: 20 },
    },
    {
      awaitServerData: true,
    },
  )
    .onUploadError(({ error }) => {
      console.error(error);
    })
    .onUploadComplete(async ({ file: { appUrl } }) => {
      const caption = await captionImage(appUrl);
      return {
        caption,
      };
    }),
} satisfies UploadThingFileRouter;

export type FileRouter = typeof fileRouter;

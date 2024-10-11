import dotenv from 'dotenv';

dotenv.config();

import { PrismaClient } from '@prisma/client';
import { utapi } from '@/server/uploadthing';

const db = new PrismaClient();

const prompts = await db.prompt.findMany();

const failedUploads = new Set<string>();

prompts.forEach(async ({ id, inpaintPhotoUrl }, index) => {
  console.log(index);
  const blob = await utapi.uploadFilesFromUrl(inpaintPhotoUrl);
  const appUrl = blob.data?.appUrl;
  if (!appUrl) {
    failedUploads.add(id);
    return;
  }
  await db.prompt.update({
    where: { id },
    data: { inpaintPhotoUrl: appUrl },
  });
});

console.log(failedUploads);

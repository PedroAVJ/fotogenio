import dotenv from 'dotenv';

dotenv.config();

import { PrismaClient } from '@prisma/client';
import { utapi } from '@/server/clients';

const db = new PrismaClient();

const prompts = await db.prompt.findMany();

const failedUploads = new Set<string>();

for (const [index, { id, inpaintPhotoUrl }] of prompts.entries()) {
  console.log(index);
  const blob = await utapi.uploadFilesFromUrl(inpaintPhotoUrl);
  const appUrl = blob.data?.appUrl;
  if (!appUrl) {
    failedUploads.add(id);
    continue;
  }
  await db.prompt.update({
    where: { id },
    data: { inpaintPhotoUrl: appUrl },
  });
}

console.log(failedUploads);

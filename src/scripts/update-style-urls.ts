import dotenv from 'dotenv';

dotenv.config();

import { PrismaClient } from '@prisma/client';
import { utapi } from '@/server/uploadthing';

const db = new PrismaClient();

const styles = await db.style.findMany();

const failedUploads = new Set<string>();

for (const [index, { id, coverPhotoUrl }] of styles.entries()) {
  console.log(index);
  const blob = await utapi.uploadFilesFromUrl(coverPhotoUrl);
  const appUrl = blob.data?.appUrl;
  if (!appUrl) {
    failedUploads.add(id);
    continue;
  }
  await db.style.update({
    where: { id },
    data: { coverPhotoUrl: appUrl },
  });
}

console.log(failedUploads);

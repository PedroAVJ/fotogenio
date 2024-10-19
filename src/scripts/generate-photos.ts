import "server-only";

import dotenv from 'dotenv';

dotenv.config();

import { db } from '@/server/clients';
import { generateImages } from '@/app/generate-images';
import { Gender } from '@prisma/client';

const userId = 'user_2nAw1i51Is1qDZQ5BTpo6LQJjFD';
const prompts = await db.prompt.findMany({
  where: {
    style: {
      gender: Gender.female
    },
  },
});

// Process prompts in batches of 10
const batchSize = 10;
for (let i = 0; i < prompts.length; i += batchSize) {
  const batch = prompts.slice(i, i + batchSize);
  await generateImages({ userId, prompts: batch });
  console.log(`Processed batch ${(i / batchSize + 1).toString()} of ${Math.ceil(prompts.length / batchSize).toString()}`);
}

console.log('All batches processed successfully');

import dotenv from 'dotenv';

dotenv.config();

import { PrismaClient } from '@prisma/client';

const db = new PrismaClient({
  log: ['query', 'error', 'warn']
});

const promptIds = ['9a9f2124-921b-4da5-94ea-0f216f77fc50'];

const prompts = await db.prompt.findMany({
  where: {
    id: {
      in: promptIds,
    },
  },
});

import { generateImages } from './generate-images';

const userId = 'user_2nUeWSbipIiM3EK5QQH659qbRiq';

await generateImages({ userId, prompts });

console.log('Images generated');

import dotenv from 'dotenv';

dotenv.config();

import { db } from '@/server/db';

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

await generateImages({ userId, prompts, seed: 42 });

console.log('Images generated');

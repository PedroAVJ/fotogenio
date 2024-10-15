import { generateImages } from './generate-images';
import { db } from '@/server/db';

const userId = 'user_2n8UwFJPgTbq1iAgMwa9B4Ubo4q';
const promptIds = ['9a9f2124-921b-4da5-94ea-0f216f77fc50'];

const prompts = await db.prompt.findMany({
  where: {
    id: {
      in: promptIds,
    },
  },
});

await generateImages({ userId, prompts, seed: 42 });

console.log('Image generated');

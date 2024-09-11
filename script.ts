import { list } from '@vercel/blob';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

import { db } from '@/server/db';

const Prompt = z.object({
  description: z.string(),
});

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const openai = new OpenAI();

const main = async () => {
  const images = await list({
    prefix: 'male/',
  });

  // Always skip the first image
  // eslint-disable-next-line no-restricted-syntax
  for (const blob of images.blobs.slice(3, 4)) {
    console.log(blob.url);
    // eslint-disable-next-line no-await-in-loop
    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content:
            'You are an image labeler for an Image Generation Model. You must describe the image in such a way that you refer to the person in the image as the "TOK". This is to trigger the fine tuning. For example: "TOK posing with a sword in a desert", "TOK in a cyberpunk city". Keep short and to one sentence.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: blob.url,
              },
            },
          ],
        },
      ],
      response_format: zodResponseFormat(Prompt, 'prompt'),
    });

    const event = completion.choices[0]?.message.parsed;
    console.log(event);
  }
};

await main();

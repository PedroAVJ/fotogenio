import { list } from '@vercel/blob';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { db } from '@/server/db';

const Prompt = z.object({
  description: z.string(),
});

// Load environment variables from .env
dotenv.config({ path: '.env' });

const openai = new OpenAI();

const main = async () => {
  const parent = await list({
    prefix: 'female/',
    mode: 'folded', 
  });

  for (const folder of parent.folders) {
    const images = await list({
      prefix: folder,
    });
    const style = await db.style.create({
      data: {
        coverPhotoUrl: `https://uxsi5qpvaazgwqzm.public.blob.vercel-storage.com/${folder}gender-female-tpgFLyrunZe1K0FK4m0JeEO2Y6evh3.png`,
        description: `female-${folder}`,
        gender: 'female',
      },
    });
    for (const blob of images.blobs.slice(1)) {
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
      const prompt = completion.choices[0]?.message.parsed?.description ?? '';
      await db.prompt.create({
        data: {
          inpaintPhotoUrl: blob.url,
          prompt,
          styleId: style.id,
        },
      });
    }
  }
};

await main();

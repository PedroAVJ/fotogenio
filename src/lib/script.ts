import dotenv from 'dotenv';

dotenv.config();

import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const Prompt = z.object({
  description: z.string(),
});

const openai = new OpenAI();

const main = async () => {
  const prompts = await db.prompt.findMany();
  for (const prompt of prompts) {
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
                url: prompt.inpaintPhotoUrl,
              },
            },
          ],
        },
      ],
      response_format: zodResponseFormat(Prompt, 'prompt'),
    });

    const promptText = completion.choices[0]?.message.parsed?.description ?? '';
    await db.prompt.update({
      where: {
        id: prompt.id,
      },
      data: {
        prompt: promptText,
      },
    });
  }
};

await main();
import "server-only";

import OpenAI from "openai";
import { retryAsync } from "ts-retry";

const openai = new OpenAI();

const systemPrompt = `
You are an image captioning AI. Your task is to caption images in excruciating detail.

The images will contain a person and it is your job to focus on the person and describe them in detail.

You should generate at least 3 paragraphs of text. Preferably more.

Whenever refering to the person, use the word "TOK". This is extremely important, since this is how another AI will know who the person is.

Do not break this rule.
`;

export async function captionImage(photoUrl: string) {
  const completion = await retryAsync(
    async () =>
      await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: photoUrl,
                },
              },
            ],
          },
        ],
      }),
    {
      maxTry: 3,
      delay: 10000,
    },
  );

  return completion.choices[0]?.message.content ?? "";
}

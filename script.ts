import dotenv from 'dotenv';
dotenv.config();
import { db } from '@/server/db';
import md5 from 'md5';
import Replicate from 'replicate';

async function main() {
  const replicate = new Replicate({
    auth: process.env['REPLICATE_API_TOKEN'] ?? '',
  });

  const userId = 'user_2mc0SPwxO16sPeho5dHbWLTUt32';
  const prompts = await db.prompt.findMany({
    where: {
      style: {
        chosenStyles: {
          some: {
            userId,
          },
        },
      },
    },
    include: {
      style: {
        include: {
          chosenStyles: {
            where: {
              userId,
            },
          },
        },
      },
    },
  });
  const modelName = `flux-${md5(userId)}`;
  const baseUrl = 'https://fotogenio-git-staging-pedroavjs-projects.vercel.app';
  const model = await replicate.models.get('pedroavj', modelName);
  const version = model.latest_version;
  if (!version) {
    throw new Error('Version not found');
  }
  console.log('starting');
  await Promise.all(prompts.map(async ({ id, prompt, inpaintPhotoUrl }) => {
    await replicate.run(
      `pedroavj/${modelName}:${version.id}`,
      {
        webhook: `${baseUrl}/api/webhooks/replicate/image-generated?userId=${userId}&promptId=${id}`,
        webhook_events_filter: ['completed'],
        input: {
          prompt,
          image: inpaintPhotoUrl,
          model: "dev",
          lora_scale: 1,
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "webp",
          guidance_scale: 3.5,
          output_quality: 90,
          prompt_strength: 0.8,
          extra_lora_scale: 1,
          num_inference_steps: 28
        }
      }
    );
  }));
  console.log('done');
}

await main();

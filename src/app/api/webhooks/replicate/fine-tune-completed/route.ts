import { NextResponse, NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { db } from '@/server/db';
import { replicate } from '@/server/replicate';
import { validateWebhook } from "replicate";
import { getBaseUrl } from '@/lib/utils';
import md5 from 'md5';

export async function POST(request: NextRequest) {
  const isValid = validateWebhook(request, env.REPLICATE_WEBHOOK_SECRET);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  const userSettings = await db.userSettings.findUnique({
    where: { userId, modelStatus: 'training' },
  });
  if (!userSettings) {
    return NextResponse.json({ error: 'Model is already training' }, { status: 400 });
  }
  await db.userSettings.update({
    where: { userId },
    data: { modelStatus: 'ready' },
  });
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
  await db.userSettings.update({
    where: { userId },
    data: { pendingPhotos: { increment: prompts.length } },
  });
  const modelName = `flux-${md5(userId)}`;
  const baseUrl = getBaseUrl();
  const model = await replicate.models.get('pedroavj', modelName);
  const version = model.latest_version;
  if (!version) {
    return NextResponse.json({ error: 'Version not found' }, { status: 400 });
  }
  await Promise.all(prompts.map(async ({ id, prompt, inpaintPhotoUrl }) => {
    await replicate.predictions.create(
      {
        model: `pedroavj/${modelName}`,
        version: version.id,
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
  return NextResponse.json({ received: true });
}

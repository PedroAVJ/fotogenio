import { NextResponse, NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { db } from '@/server/db';
import { replicate } from '@/server/replicate';
import { validateWebhook } from "replicate";

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
  await db.userSettings.update({
    where: { userId },
    data: { modelStatus: 'ready' },
  });
  const choosenStyles = await db.chosenStyle.findMany({
    where: { userId },
    include: {
      style: true,
    },
  });
  const modelName = `flux-${userId}`;
  const baseUrl = env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
    : env.WEBHOOK_MOCK_URL;
  await Promise.all(choosenStyles.map(async (choosenStyle) => {
    await replicate.run(
      `${env.REPLICATE_OWNER}/${modelName}`,
      {
        webhook: `${baseUrl}/api/webhooks/replicate/image-generated?userId=${userId}&styleId=${choosenStyle.styleId}`,
        webhook_events_filter: ['completed'],
        input: {
          prompt: choosenStyle.style.description,
          image: choosenStyle.style.coverPhotoUrl,
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
  }))
  return NextResponse.json({ received: true });
}

import "server-only";

import { replicate, db } from "@/lib/clients";
import md5 from "md5";
import { baseUrl } from "@/lib/urls";
import { Prompt, Prisma } from "@prisma/client";
import { Route } from "next";

type GeneratedPhotoWithPrompt = Prisma.GeneratedPhotoGetPayload<{
  include: { prompt: true };
}>;

async function generateImage(
  generatedPhoto: GeneratedPhotoWithPrompt,
  modelName: string,
  version: string,
  seed: number | undefined,
) {
  const path: Route = "/api/webhooks/replicate/image-generated";
  const webhookUrl = `${baseUrl}${path}?generatedPhotoId=${generatedPhoto.id}`;
  await replicate.predictions.create({
    model: `pedroavj/${modelName}`,
    version,
    webhook: webhookUrl,
    webhook_events_filter: ["completed"],
    input: {
      prompt: generatedPhoto.prompt.prompt,
      num_inference_steps: 50,
      output_quality: 100,
      seed,
      disable_safety_checker: true,
    },
  });
}

interface GenerateImageParams {
  userId: string;
  prompts: Prompt[];
  seed?: number;
}

export async function generateImages({
  userId,
  prompts,
  seed,
}: GenerateImageParams) {
  const generatedPhotos = await db.generatedPhoto.createManyAndReturn({
    data: prompts.map(({ id }) => ({ userId, promptId: id })),
    include: {
      prompt: true,
    },
  });
  const modelName = `flux-${md5(userId)}`;
  const model = await replicate.models.get("pedroavj", modelName);
  const version = model.latest_version?.id;
  if (!version) {
    throw new Error("No version found for model");
  }

  // Process in batches of 10
  const batchSize = 10;
  for (let i = 0; i < generatedPhotos.length; i += batchSize) {
    const batch = generatedPhotos.slice(i, i + batchSize);
    await Promise.all(
      batch.map((prompt) => generateImage(prompt, modelName, version, seed)),
    );
  }
}

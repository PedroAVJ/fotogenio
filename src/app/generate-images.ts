import { replicate, db } from "@/server/clients";
import md5 from "md5";
import { baseUrl } from "@/server/urls";
import { Prompt, Prisma } from "@prisma/client";
import { Route } from "next";

type GeneratedPhotoWithPrompt = Prisma.GeneratedPhotoGetPayload<{
  include: { prompt: true }
}>;

interface GenerateImageParams {
  userId: string;
  prompts: Prompt[];
  seed?: number;
}

export async function generateImages({ userId, prompts, seed }: GenerateImageParams) {
  const generatedPhotos = await db.generatedPhoto.createManyAndReturn({
    data: prompts.map(({ id }) => ({ userId, promptId: id })),
    include: {
      prompt: true
    }
  });
  const modelName = `flux-${md5(userId)}`;
  const model = await replicate.models.get('pedroavj', modelName);
  const version = model.latest_version?.id ?? '';
  async function generateImage(generatedPhoto: GeneratedPhotoWithPrompt) {
    const path: Route = '/api/webhooks/replicate/image-generated'
    const webhookUrl = `${baseUrl}${path}?generatedPhotoId=${generatedPhoto.id}`;
    await replicate.predictions.create(
      {
        model: `pedroavj/${modelName}`,
        version,
        webhook: webhookUrl,
        webhook_events_filter: ['completed'],
        input: {
          prompt: generatedPhoto.prompt.prompt,
          num_inference_steps: 50,
          output_quality: 100,
          seed,
        }
      }
    );
  }
  await Promise.all(generatedPhotos.map(generateImage));
}

import { replicate } from "@/server/replicate";
import md5 from "md5";
import { webhookBaseUrl } from "@/server/urls";
import { Prompt } from "@prisma/client";

interface GenerateImageParams {
  userId: string;
  prompts: Prompt[];
  seed?: number;
}

export async function generateImages({ userId, prompts, seed }: GenerateImageParams) {
  const modelName = `flux-${md5(userId)}`;
  const model = await replicate.models.get('pedroavj', modelName);
  const version = model.latest_version?.id ?? '';
  async function generateImage(prompt: Prompt) {
    const webhookUrl = `${webhookBaseUrl}/replicate/image-generated?userId=${userId}&promptId=${prompt.id}`;
    await replicate.predictions.create(
      {
        model: `pedroavj/${modelName}`,
        version,
        webhook: webhookUrl,
        webhook_events_filter: ['completed'],
        input: {
          prompt: prompt.prompt,
          num_inference_steps: 50,
          output_quality: 100,
          seed,
        }
      }
    );
  }
  await Promise.all(prompts.map(generateImage));
}

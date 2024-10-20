import md5 from "md5";
import { replicate } from "@/lib/clients";
import { Route } from "next";
import { baseUrl } from "@/lib/urls";

export async function createModel(userId: string, zippedPhotosUrl: string) {
  const modelName = `flux-${md5(userId)}`;
  const model = await replicate.models.create("pedroavj", modelName, {
    visibility: "private",
    hardware: "gpu-t4",
  });
  const url: Route = "/api/webhooks/replicate/fine-tune-completed";
  const webhook = `${baseUrl}${url}?userId=${userId}`;
  await replicate.trainings.create(
    "ostris",
    "flux-dev-lora-trainer",
    "885394e6a31c6f349dd4f9e6e7ffbabd8d9840ab2559ab78aed6b2451ab2cfef",
    {
      destination: `${model.owner}/${model.name}`,
      webhook,
      webhook_events_filter: ["completed"],
      input: {
        steps: 1000,
        lora_rank: 16,
        optimizer: "adamw8bit",
        batch_size: 1,
        resolution: "512,768,1024",
        autocaption: true,
        input_images: zippedPhotosUrl,
        trigger_word: "TOK",
        learning_rate: 0.0004,
        wandb_project: "flux_train_replicate",
        wandb_save_interval: 100,
        caption_dropout_rate: 0.05,
        cache_latents_to_disk: false,
        wandb_sample_interval: 100,
      },
    },
  );
}

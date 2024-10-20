import "server-only";

import dotenv from 'dotenv';

dotenv.config();

import { replicate } from '@/lib/clients';

import md5 from 'md5';

const userId = 'user_2nEGVSXzK0Qs918afjV75q3KgIJ';
const modelName = `flux-${md5(userId)}`;

const baseUrl = 'https://fotogenio-git-staging-pedroavjs-projects.vercel.app';
const zippedPhotosUrl = 'https://utfs.io/f/wB1nfjdKLAC8e6nKojagxoyUu925OCphs7BkHinW8Mb0INmK';

await replicate.trainings.create(
  "ostris",
  "flux-dev-lora-trainer",
  "885394e6a31c6f349dd4f9e6e7ffbabd8d9840ab2559ab78aed6b2451ab2cfef",
  {
    destination: `pedroavj/${modelName}`,
    webhook: `${baseUrl}/api/webhooks/replicate/fine-tune-completed?userId=${userId}`,
    webhook_events_filter: ['completed'],
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
      wandb_sample_interval: 100
    }
  }
)

console.log('Training created');
import dotenv from 'dotenv';

dotenv.config();

import { replicate } from '@/server/clients';

import md5 from 'md5';

const userId = 'user_2nEGVSXzK0Qs918afjV75q3KgIJ';
const modelName = `flux-${md5(userId)}`;

const model = await replicate.models.get('pedroavj', modelName);
const version = model.latest_version;
if (!version) {
  console.log('Version not found');
  process.exit(1);
}
const prediction = await replicate.run(
  `pedroavj/${modelName}:${version.id}`,
  {
    input: {
      prompt: 'TOK smiling',
      num_inference_steps: 50,
      output_quality: 100,
    }
  }
);

console.log(prediction);

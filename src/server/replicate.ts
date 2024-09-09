import 'server-only';

import Replicate from 'replicate';

import { env } from './env';

export const replicate = new Replicate({
  auth: env.REPLICATE_API_TOKEN,
});
import Replicate from 'replicate';

import { env } from '@/lib/env';

export const replicate = new Replicate({
  auth: env.REPLICATE_API_TOKEN,
});

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url(),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    BLOB_READ_WRITE_TOKEN: z.string(),
    REPLICATE_API_TOKEN: z.string(),
    REPLICATE_OWNER: z.string(),
    CLERK_SECRET_KEY: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    WEBHOOK_MOCK_URL: z.string().url(),
    VERCEL_PROJECT_PRODUCTION_URL: z.string().url().optional(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
  },
  experimental__runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

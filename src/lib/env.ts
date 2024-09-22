import { createEnv } from '@t3-oss/env-nextjs';
import { vercel } from "@t3-oss/env-core/presets";
import { z } from 'zod';

export const env = createEnv({
  server: {
    CREDITS_PRICE_ID: z.string(),
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url(),
    BLOB_READ_WRITE_TOKEN: z.string(),
    REPLICATE_WEBHOOK_SECRET: z.string(),
    REPLICATE_API_TOKEN: z.string(),
    REPLICATE_OWNER: z.string(),
    CLERK_SECRET_KEY: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    WEBHOOK_MOCK_URL: z.string().url(),
    NGROK_AUTH_TOKEN: z.string(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env['NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'],
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'],
  },
  emptyStringAsUndefined: true,
  isServer: typeof window === "undefined",
  extends: [vercel()],
});

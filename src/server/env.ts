import 'server-only';

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    TURSO_PARENT_DB_URL: z.string().url(),
    TURSO_ORG_NAME: z.string(),
    TURSO_GROUP_AUTH_TOKEN: z.string(),
    TURSO_USER_API_TOKEN: z.string(),
    CLERK_SECRET_KEY: z.string(),
    CLERK_WEBHOOK_SECRET: z.string(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
  },
  experimental__runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

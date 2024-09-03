import 'server-only';

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    TURSO_PARENT_DB_URL: z.string().url(),
    TURSO_ORG: z.string(),
    TURSO_GROUP_AUTH_TOKEN: z.string(),
    TURSO_PARENT_AUTH_TOKEN: z.string(),
    CATALOGOS_SAT_DATABASE_URL: z.string().url(),
    CLERK_SECRET_KEY: z.string(),
    GOOGLE_PLACES_API_KEY: z.string(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
  },
  experimental__runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

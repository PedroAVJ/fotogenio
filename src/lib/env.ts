import { vercel } from "@t3-oss/env-core/presets";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    CREDITS_PRICE_ID: z.string(),
    REPLICATE_WEBHOOK_SECRET: z.string(),
    REPLICATE_API_TOKEN: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"],
  },
  emptyStringAsUndefined: true,
  isServer: typeof window === "undefined",
  extends: [vercel()],
});

import "server-only";

import { env } from "@/lib/env";

/* Prisma client */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export { db };

/* Replicate client */
import Replicate from "replicate";

export const replicate = new Replicate({
  auth: env.REPLICATE_API_TOKEN,
});

/* Stripe client */
import Stripe from "stripe";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

/* TRPC client */
import { auth } from "@clerk/nextjs/server";
import { initTRPC } from "@trpc/server";
import { experimental_nextAppDirCaller } from "@trpc/server/adapters/next-app-dir";
import * as Sentry from "@sentry/nextjs";

const trpc = initTRPC.create();

export const api = trpc.procedure
  .experimental_caller(experimental_nextAppDirCaller({}))
  .use(
    Sentry.trpcMiddleware({
      attachRpcInput: true,
    }),
  )
  .use(async (opts) => {
    const session = auth().protect();
    return opts.next({
      ctx: {
        session,
      },
    });
  });

/* Uploadthing client */
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

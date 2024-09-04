import 'server-only';

import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import { experimental_nextAppDirCaller } from '@trpc/server/adapters/next-app-dir';

import { ratelimit } from '@/server/ratelimit';

const trpc = initTRPC.create();

export const api = trpc.procedure
  .experimental_caller(experimental_nextAppDirCaller({}))
  .use(async (opts) => {
    const { userId } = auth().protect();
    const { success } = await ratelimit.limit(userId);
    if (!success) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'Rate limited',
      });
    }
    return opts.next();
  });

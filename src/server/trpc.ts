import { auth } from '@clerk/nextjs/server';
import { initTRPC } from '@trpc/server';
import { experimental_nextAppDirCaller } from '@trpc/server/adapters/next-app-dir';

const trpc = initTRPC.create();

export const api = trpc.procedure
  .experimental_caller(experimental_nextAppDirCaller({}))
  .use(async (opts) => {
    const session = auth().protect();
    return opts.next({
      ctx: {
        session,
      },
    });
  });

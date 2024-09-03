import 'server-only';

import { auth } from '@clerk/nextjs/server';
import { initTRPC } from '@trpc/server';
import { experimental_nextAppDirCaller } from '@trpc/server/adapters/next-app-dir';

interface Meta {
  roles: string[];
  permissions: string[];
}

export const t = initTRPC.meta<Meta>().create();

export const api = t.procedure
  .experimental_caller(experimental_nextAppDirCaller({}))
  .use(async (opts) => {
    auth().protect();
    opts.meta?.roles.forEach((role) => auth().protect({ role }));
    opts.meta?.permissions.forEach((permission) =>
      auth().protect({ permission }),
    );
    return opts.next();
  });

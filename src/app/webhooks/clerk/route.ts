import { createWebhooksHandler } from '@brianmmdev/clerk-webhooks-handler';
import { createClient } from '@tursodatabase/api';
import md5 from 'md5';

import { env } from '@/server/env';

const turso = createClient({
  token: env.TURSO_USER_API_TOKEN,
  org: env.TURSO_ORG_NAME,
});

const handler = createWebhooksHandler({
  onUserCreated: async (payload) => {
    const databaseName = md5(payload.id);
    try {
      await turso.databases.create(databaseName, {
        schema: env.TURSO_PARENT_DB_URL,
      });
    } catch (err) {
      return new Response('Database creation failed', { status: 500 });
    }
    return new Response('Database created', { status: 200 });
  },
});

export const { POST } = handler;

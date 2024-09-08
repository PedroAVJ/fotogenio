import 'server-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '@/server/env';

import * as chosenStyles from './chosen-styles';
import * as relations from './relations';
import * as styles from './styles';
import * as users from './users';

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const url = env.SUPABASE_DB_URL;

const conn = globalForDb.conn ?? postgres(url, { prepare: false });
if (env.NODE_ENV !== 'production') globalForDb.conn = conn;

export const db = drizzle(conn, {
  schema: {
    ...chosenStyles,
    ...relations,
    ...styles,
    ...users,
  },
});

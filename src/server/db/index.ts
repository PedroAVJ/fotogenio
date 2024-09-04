import 'server-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '@/server/env';

import * as almacen from './schema/divisions/almacen';
import * as pedido from './schema/divisions/pedido';
import * as producto from './schema/divisions/producto';
import * as ruta from './schema/divisions/ruta';
import * as vehiculo from './schema/divisions/vehiculo';
import * as chofer from './schema/organizations/chofer';
import * as cliente from './schema/organizations/cliente';
import * as division from './schema/organizations/division';

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
    ...almacen,
    ...chofer,
    ...cliente,
    ...division,
    ...pedido,
    ...producto,
    ...ruta,
    ...vehiculo,
  },
});

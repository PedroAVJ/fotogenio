import 'server-only';

import { auth } from '@clerk/nextjs/server';
import { type Client, createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

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
  client: Client | undefined;
};

const { orgSlug } = auth();
const url = `libsql://${orgSlug}-${env.TURSO_ORG}.turso.io`;
const authToken = env.TURSO_GROUP_AUTH_TOKEN;

export const client = globalForDb.client ?? createClient({ url, authToken });
if (env.NODE_ENV !== 'production') globalForDb.client = client;

export const db = drizzle(client, {
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

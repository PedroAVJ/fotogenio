import { randomUUID } from 'crypto';
import { addDays, addMonths, startOfDay } from 'date-fns';
import { relations, sql } from 'drizzle-orm';
import {
  integer,
  real,
  sqliteTable,
  text,
  unique,
} from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';

import { puntoDeEntrega } from '../organizations/cliente';
import { division } from '../organizations/division';
import { producto } from './producto';

export const pedido = sqliteTable('pedido', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => randomUUID()),
  divisionId: text('divisionId')
    .notNull()
    .references(() => division.id),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
  puntoDeEntregaId: text('puntoDeEntregaId')
    .notNull()
    .references(() => puntoDeEntrega.id),
  fechaDeEntrega: integer('fechaDeEntrega', { mode: 'timestamp' }).notNull(),
});

const today = startOfDay(new Date());
const tomorrow = addDays(today, 1);
const oneMonthFromNow = addMonths(today, 1);

export const pedidoSchema = createInsertSchema(pedido, {
  fechaDeEntrega: (schema) =>
    schema.fechaDeEntrega.min(tomorrow).max(oneMonthFromNow),
});

export const articulo = sqliteTable(
  'articulo',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .$default(() => randomUUID()),
    pedidoId: text('pedidoId')
      .notNull()
      .references(() => pedido.id),
    productoId: text('productoId')
      .notNull()
      .references(() => producto.id),
    cantidad: real('cantidad').notNull(),
    precioUnitario: real('precioUnitario').notNull(),
    tasaDeIva: real('tasaDeIva').notNull(),
    retencionDeIva: real('retencionDeIva').notNull(),
    retencionDeIsr: real('retencionDeIsr').notNull(),
    tasaDeIeps: real('tasaDeIeps').notNull(),
  },
  (table) => ({
    unique: unique().on(table.pedidoId, table.productoId),
  }),
);

export const MAX_CANTIDAD = 10_000;

export const articuloSchema = createInsertSchema(articulo, {
  cantidad: (schema) =>
    schema.cantidad.positive().max(MAX_CANTIDAD).multipleOf(0.01),
});

export const pedidoRelations = relations(pedido, ({ one, many }) => ({
  puntoDeEntrega: one(puntoDeEntrega, {
    fields: [pedido.puntoDeEntregaId],
    references: [puntoDeEntrega.id],
  }),
  articulos: many(articulo),
}));

export const articuloRelations = relations(articulo, ({ one }) => ({
  pedido: one(pedido, {
    fields: [articulo.pedidoId],
    references: [pedido.id],
  }),
}));

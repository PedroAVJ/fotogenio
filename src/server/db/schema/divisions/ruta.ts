import { randomUUID } from 'crypto';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';

import { puntoDeEntrega } from '../organizations/cliente';
import { division } from '../organizations/division';

export const ruta = sqliteTable('ruta', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => randomUUID()),
  divisionId: text('divisionId')
    .notNull()
    .references(() => division.id),
  nombre: text('nombre').notNull().unique(),
});

export const rutaSchema = createInsertSchema(ruta, {
  nombre: (schema) => schema.nombre.min(1),
});

export const parada = sqliteTable(
  'parada',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .$default(() => randomUUID()),
    lunes: integer('lunes', { mode: 'boolean' }).notNull(),
    martes: integer('martes', { mode: 'boolean' }).notNull(),
    miercoles: integer('miercoles', { mode: 'boolean' }).notNull(),
    jueves: integer('jueves', { mode: 'boolean' }).notNull(),
    viernes: integer('viernes', { mode: 'boolean' }).notNull(),
    sabado: integer('sabado', { mode: 'boolean' }).notNull(),
    domingo: integer('domingo', { mode: 'boolean' }).notNull(),
    visitOrder: integer('visitOrder').notNull(),
    puntoDeEntregaId: text('puntoDeEntregaId')
      .notNull()
      .references(() => puntoDeEntrega.id),
    rutaId: text('rutaId')
      .notNull()
      .references(() => ruta.id),
  },
  (table) => ({
    unique: unique().on(table.rutaId, table.puntoDeEntregaId),
  }),
);

export const paradaSchema = createInsertSchema(parada, {
  visitOrder: (schema) => schema.visitOrder.int().nonnegative(),
});

export const rutaRelations = relations(ruta, ({ many }) => ({
  paradas: many(parada),
}));

export const paradaRelations = relations(parada, ({ one }) => ({
  puntoDeEntrega: one(puntoDeEntrega, {
    fields: [parada.puntoDeEntregaId],
    references: [puntoDeEntrega.id],
  }),
  ruta: one(ruta, {
    fields: [parada.rutaId],
    references: [ruta.id],
  }),
}));

import { randomUUID } from 'crypto';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';

import { division } from '../organizations/division';

export const almacen = sqliteTable('almacen', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => randomUUID()),
  divisionId: text('divisionId')
    .notNull()
    .references(() => division.id),
  nombre: text('nombre').notNull().unique(),
  placeId: text('placeId').notNull(),
  formattedAddress: text('formattedAddress').notNull(),
  referencia: text('referencia').notNull(),
});

export const almacenSchema = createInsertSchema(almacen, {
  nombre: (schema) => schema.nombre.min(1),
});

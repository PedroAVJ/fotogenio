import { randomUUID } from 'crypto';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';

export const division = sqliteTable('division', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => randomUUID()),
  nombre: text('nombre').unique().notNull(),
});

export const divisionSchema = createInsertSchema(division, {
  nombre: (schema) => schema.nombre.min(1),
});

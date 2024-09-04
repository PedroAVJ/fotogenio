import { randomUUID } from 'crypto';
import { addDays, addYears, startOfDay } from 'date-fns';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';

export const chofer = sqliteTable('chofer', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => randomUUID()),
  codigo: text('codigo').notNull().unique(),
  nombreCompleto: text('nombreCompleto').notNull(),
  numeroDeLicencia: text('numeroDeLicencia').notNull(),
  fechaDeVencimientoDeLicencia: integer('fechaDeVencimientoDeLicencia', {
    mode: 'timestamp',
  }).notNull(),
});

const today = startOfDay(new Date());
const tomorrow = addDays(today, 1);
const tenYearsFromNow = addYears(today, 10);

export const choferSchema = createInsertSchema(chofer, {
  codigo: (schema) => schema.codigo.min(1),
  nombreCompleto: (schema) => schema.nombreCompleto.min(1),
  numeroDeLicencia: (schema) => schema.numeroDeLicencia.min(1),
  fechaDeVencimientoDeLicencia: (schema) =>
    schema.fechaDeVencimientoDeLicencia.min(tomorrow).max(tenYearsFromNow),
});

import { randomUUID } from 'crypto';
import { addDays, addYears, startOfDay } from 'date-fns';
import { relations } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';

import { chofer } from '../organizations/chofer';
import { division } from '../organizations/division';

export const vehiculo = sqliteTable('vehiculo', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => randomUUID()),
  divisionId: text('divisionId')
    .notNull()
    .references(() => division.id),
  codigo: text('codigo').notNull().unique(),
  descripcion: text('descripcion').notNull(),
  tipoDeOdometro: text('tipoDeOdometro', {
    enum: ['Kilómetros', 'Millas', 'Horas', 'Sin odómetro'],
  }).notNull(),
  tipoDeVehiculo: text('tipoDeVehiculo', {
    enum: ['Propio', 'Terceros'],
  }).notNull(),
  identificadorDeGps: text('identificadorDeGps').notNull(),
  tipoDeCombustible: text('tipoDeCombustible', {
    enum: ['Gasolina', 'Diésel', 'Gas butano'],
  }).notNull(),
  numeroDePolizaDeSeguro: text('numeroDePolizaDeSeguro').notNull(),
  fechaDeExpiracionDePolizaDeSeguro: integer(
    'fechaDeExpiracionDePolizaDeSeguro',
    {
      mode: 'timestamp',
    },
  ).notNull(),
  horometraje: real('horometraje').notNull(),
  choferId: text('choferId')
    .unique()
    .references(() => chofer.id),
});

const today = startOfDay(new Date());
const tomorrow = addDays(today, 1);
const tenYearsFromNow = addYears(today, 10);

export const vehiculoSchema = createInsertSchema(vehiculo, {
  codigo: (schema) => schema.codigo.min(1),
  descripcion: (schema) => schema.descripcion.min(1),
  identificadorDeGps: (schema) => schema.identificadorDeGps.min(1),
  numeroDePolizaDeSeguro: (schema) => schema.numeroDePolizaDeSeguro.min(1),
  fechaDeExpiracionDePolizaDeSeguro: (schema) =>
    schema.fechaDeExpiracionDePolizaDeSeguro.min(tomorrow).max(tenYearsFromNow),
  horometraje: (schema) => schema.horometraje.nonnegative(),
});

export const vehiculoRelations = relations(vehiculo, ({ one }) => ({
  chofer: one(chofer, {
    fields: [vehiculo.choferId],
    references: [chofer.id],
  }),
}));

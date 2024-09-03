import { randomUUID } from 'crypto';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';

import { MAX_MONEY, MAX_PERCENT } from '@/lib/constants';

export const producto = sqliteTable('producto', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => randomUUID()),
  divisionId: text('divisionId').notNull(),
  codigo: text('codigo').notNull().unique(),
  descripcion: text('descripcion').notNull(),
  precioUnitario: real('precioUnitario').notNull(),
  objetoDeImpuesto: text('objetoDeImpuesto', {
    enum: [
      'No objeto de impuesto',
      'Sí objeto de impuesto',
      'Sí objeto de impuesto y no obligado al desglose',
    ],
  }).notNull(),
  identificador: text('identificador', { length: 10 }).notNull(),
  tipoDeIva: text('tipoDeIva', {
    enum: ['Tasa general', 'Al 0%', 'Exento', 'Otra tasa', 'N/A'],
  }).notNull(),
  tasaDeIva: real('tasaDeIva').notNull(),
  retencionDeIva: real('retencionDeIva').notNull(),
  retencionDeIsr: real('retencionDeIsr').notNull(),
  tasaDeIeps: real('tasaDeIeps').notNull(),
  cuentaContableId: integer('cuentaContableId').notNull(),
  unidadDeMedidaClave: text('unidadDeMedidaClave').notNull(),
  productoOServicioClave: integer('productoOServicioClave').notNull(),
});

export const MAX_TASA_DE_IVA = 16;

export const productoSchema = createInsertSchema(producto, {
  codigo: (schema) => schema.codigo.min(1),
  descripcion: (schema) => schema.descripcion.min(1),
  precioUnitario: (schema) =>
    schema.precioUnitario.positive().max(MAX_MONEY).multipleOf(0.01),
  tasaDeIva: (schema) =>
    schema.tasaDeIva.nonnegative().max(MAX_TASA_DE_IVA).multipleOf(0.01),
  retencionDeIva: (schema) =>
    schema.retencionDeIva.nonnegative().max(MAX_TASA_DE_IVA).multipleOf(0.01),
  retencionDeIsr: (schema) =>
    schema.retencionDeIsr.nonnegative().max(MAX_PERCENT).multipleOf(0.01),
  tasaDeIeps: (schema) =>
    schema.tasaDeIeps.nonnegative().max(MAX_PERCENT).multipleOf(0.01),
}).refine(
  ({
    objetoDeImpuesto,
    tipoDeIva,
    tasaDeIva,
    retencionDeIva,
    retencionDeIsr,
    tasaDeIeps,
  }) => {
    if (objetoDeImpuesto === 'No objeto de impuesto') {
      if (tipoDeIva === 'Tasa general' || tipoDeIva === 'Otra tasa') {
        return false;
      }
      if (
        tasaDeIva !== 0 ||
        retencionDeIva !== 0 ||
        retencionDeIsr !== 0 ||
        tasaDeIeps !== 0
      ) {
        return false;
      }
    } else {
      if (
        tipoDeIva === 'N/A' ||
        tipoDeIva === 'Exento' ||
        tipoDeIva === 'Al 0%'
      ) {
        return false;
      }
      if (
        tasaDeIva === 0 ||
        retencionDeIva === 0 ||
        retencionDeIsr === 0 ||
        tasaDeIeps === 0
      ) {
        return false;
      }
    }
    if (
      tipoDeIva === 'N/A' ||
      tipoDeIva === 'Exento' ||
      tipoDeIva === 'Al 0%'
    ) {
      if (tasaDeIva !== 0 || retencionDeIva !== 0) {
        return false;
      }
    } else if (tipoDeIva === 'Tasa general') {
      if (tasaDeIva !== 16) {
        return false;
      }
    }
    if (retencionDeIva > tasaDeIva) {
      return false;
    }
    return true;
  },
);

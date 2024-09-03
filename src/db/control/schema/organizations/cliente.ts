import { randomUUID } from 'crypto';
import { relations } from 'drizzle-orm';
import {
  integer,
  real,
  sqliteTable,
  text,
  unique,
} from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { isValidPhoneNumber } from 'libphonenumber-js';
import validateRfc from 'validate-rfc';

import { MAX_MONEY, MAX_PERCENT } from '@/lib/constants';

import { producto } from '../divisions/producto';

export const cliente = sqliteTable('cliente', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => randomUUID()),

  // General
  codigo: text('codigo').notNull().unique(),
  nombreComercial: text('nombreComercial').notNull(),
  regimenCapital: text('regimenCapital').notNull(),

  // Dirección
  codigoPostal: text('codigoPostal').notNull(),
  colonia: text('colonia').notNull(),
  pais: text('pais', {
    enum: ['México', 'Estados Unidos', 'Canadá'],
  }).notNull(),
  calle: text('calle').notNull(),
  ciudad: text('ciudad').notNull(),
  estado: text('estado').notNull(),

  // Fiscal
  nombreLegal: text('nombreLegal').notNull(),
  rfc: text('rfc').notNull(),
  idTributario: text('idTributario').notNull(),
  cuentaContableId: integer('cuentaContableId').notNull(),
  usoDeCfdiClave: text('usoDeCfdiClave').notNull(),
  regimenFiscalClave: text('regimenFiscalClave').notNull(),
  formaDePagoClave: text('formaDePagoClave').notNull(),

  // Crédito
  topeDeCredito: integer('topeDeCredito').notNull(),
  descuento: integer('descuento').notNull(),
  diasACredito: integer('diasACredito').notNull(),
  esPrecioEspecial: integer('esPrecioEspecial', { mode: 'boolean' }).notNull(),
});

export const MAX_DIAS_A_CREDITO = 90;

export const clienteSchema = createInsertSchema(cliente, {
  // General
  codigo: (schema) => schema.codigo.min(1),
  nombreComercial: (schema) => schema.nombreComercial.min(1),
  regimenCapital: (schema) => schema.regimenCapital.min(1),

  // Dirección
  codigoPostal: (schema) => schema.codigoPostal.min(5),
  colonia: (schema) => schema.colonia.min(1),
  calle: (schema) => schema.calle.min(1),
  ciudad: (schema) => schema.ciudad.min(1),
  estado: (schema) => schema.estado.min(1),

  // Fiscal
  nombreLegal: (schema) => schema.nombreLegal.min(1),
  rfc: (schema) => schema.rfc.refine(validateRfc),

  // Crédito
  topeDeCredito: (schema) =>
    schema.topeDeCredito.int().nonnegative().max(MAX_MONEY),
  descuento: (schema) => schema.descuento.int().nonnegative().max(MAX_PERCENT),
  diasACredito: (schema) =>
    schema.diasACredito.int().nonnegative().max(MAX_DIAS_A_CREDITO),
});

export const contacto = sqliteTable('contacto', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => randomUUID()),
  grupo: text('grupo').notNull(),
  nombre: text('nombre').notNull(),
  correoElectronico: text('correoElectronico').notNull(),
  lineaFija: text('lineaFija').notNull(),
  celular: text('celular'),
  clienteId: text('clienteId')
    .notNull()
    .references(() => cliente.id),
});

export const contactoSchema = createInsertSchema(contacto, {
  grupo: (schema) => schema.grupo.min(1),
  nombre: (schema) => schema.nombre.min(1),
  correoElectronico: (schema) => schema.correoElectronico.email(),
  lineaFija: (schema) => schema.lineaFija.refine(isValidPhoneNumber),
  celular: (schema) => schema.celular.refine(isValidPhoneNumber),
});

export const puntoDeEntrega = sqliteTable('puntoDeEntrega', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => randomUUID()),
  clienteId: text('clienteId')
    .notNull()
    .references(() => cliente.id),
  nombre: text('nombre').notNull().unique(),
  placeId: text('placeId').notNull(),
  formattedAddress: text('formattedAddress').notNull(),
  referencia: text('referencia').notNull(),
});

export const puntoDeEntregaSchema = createInsertSchema(puntoDeEntrega, {
  nombre: (schema) => schema.nombre.min(1),
});

export const precioEspecial = sqliteTable(
  'precioEspecial',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .$default(() => randomUUID()),
    clienteId: text('clienteId')
      .notNull()
      .references(() => cliente.id),
    productoId: text('productoId')
      .notNull()
      .references(() => producto.id),
    precioEspecial: real('precioEspecial').notNull(),
  },
  (table) => ({
    unique: unique().on(table.clienteId, table.productoId),
  }),
);

export const precioEspecialSchema = createInsertSchema(precioEspecial, {
  precioEspecial: (schema) =>
    schema.precioEspecial.nonnegative().max(MAX_MONEY).multipleOf(0.01),
});

export const clienteRelations = relations(cliente, ({ many }) => ({
  contactos: many(contacto),
  puntosDeEntrega: many(puntoDeEntrega),
  preciosEspeciales: many(precioEspecial),
}));

export const contactoRelations = relations(contacto, ({ one }) => ({
  cliente: one(cliente, {
    fields: [contacto.clienteId],
    references: [cliente.id],
  }),
}));

export const puntoDeEntregaRelations = relations(puntoDeEntrega, ({ one }) => ({
  cliente: one(cliente, {
    fields: [puntoDeEntrega.clienteId],
    references: [cliente.id],
  }),
}));

export const precioEspecialRelations = relations(precioEspecial, ({ one }) => ({
  cliente: one(cliente, {
    fields: [precioEspecial.clienteId],
    references: [cliente.id],
  }),
  producto: one(producto, {
    fields: [precioEspecial.productoId],
    references: [producto.id],
  }),
}));

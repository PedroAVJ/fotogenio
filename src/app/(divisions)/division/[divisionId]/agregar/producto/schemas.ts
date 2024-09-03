import { MAX_PERCENT, MAX_TASA_DE_IVA } from '@/lib/constants';
import { z } from '@/lib/es-zod';
import { objetoDeImpuestoChoices, tipoDeIvaChoices } from '@/server/db/schema';

const unidadDeMedidaSchema = z
  .object({
    id: z.string(),
    clave: z.string(),
    nombre: z.string(),
  })
  .refine((data) => data.id.length > 0, {
    message: 'La unidad de medida es requerida',
  });

const productoOServicioSchema = z
  .object({
    id: z.string(),
    clave: z.number(),
    descripcion: z.string(),
  })
  .refine((data) => data.id.length > 0, {
    message: 'El producto o servicio es requerido',
  });

export const productoSchema = z.object({
  divisionId: z.string().min(1, 'La división es requerida'),
  codigo: z.string().min(1),
  descripcion: z.string().min(1),
  precioUnitario: z.number().nonnegative().multipleOf(0.01),
  objetoDeImpuesto: z.enum(objetoDeImpuestoChoices),
  identificador: z.string().max(10),
  tipoDeIva: z.enum(tipoDeIvaChoices),
  tasaDeIva: z.number().nonnegative().max(MAX_TASA_DE_IVA).multipleOf(0.01),
  retencionDeIva: z
    .number()
    .nonnegative()
    .max(MAX_TASA_DE_IVA)
    .multipleOf(0.01),
  retencionDeIsr: z.number().nonnegative().max(MAX_PERCENT).multipleOf(0.01),
  tasaDeIeps: z.number().nonnegative().max(MAX_PERCENT).multipleOf(0.01),
  cuentaContable: z.nativeEnum(CuentaContable),
  unidadDeMedida: unidadDeMedidaSchema,
  productoOServicio: productoOServicioSchema,
});

export type ProductoSchema = z.infer<typeof productoSchema>;

import { isValidPhoneNumber } from 'libphonenumber-js';
import validateRfc from 'validate-rfc';

import { z } from '@/lib/es-zod';
import { paisChoices } from '@/server/db/schema';

export const puntoDeEntregaSchema = z.object({
  place: z
    .object({
      id: z.string(),
      formattedAddress: z.string(),
    })
    .refine((data) => data.id.length > 0, {
      message: 'La dirección es requerida',
    }),
  referencia: z.string(),
});

export type PuntoDeEntregaSchema = z.infer<typeof puntoDeEntregaSchema>;

export const contactoSchema = z.object({
  grupo: z.string().min(1),
  nombre: z.string().min(1),
  correoElectronico: z.string().email(),
  lineaFija: z.string().refine((value) => isValidPhoneNumber(value), {
    message: 'Número de linea fija inválido',
  }),
  celular: z
    .string()
    .refine((value) => isValidPhoneNumber(value), {
      message: 'Número de celular inválido',
    })
    .nullable(),
});

export type ContactoSchema = z.infer<typeof contactoSchema>;

export const precioEspecialSchema = z.object({
  producto: z
    .object({
      id: z.string(),
      divisionId: z.string(),
      codigo: z.string(),
      descripcion: z.string(),
    })
    .refine((data) => data.id.length > 0, {
      message: 'El producto es requerido',
    }),
  precioEspecial: z.number().nonnegative().multipleOf(0.01),
});

export type PrecioEspecialSchema = z.infer<typeof precioEspecialSchema>;

export const clienteSchema = z.object({
  codigo: z.string().min(1),
  nombreComercial: z.string().min(1),
  regimenCapital: z.string().min(1),
  codigoPostal: z.string().length(5),
  colonia: z.string().min(1),
  pais: z.enum(paisChoices),
  calle: z.string().min(1),
  ciudad: z.string().min(1),
  estado: z.string().min(1),
  contactos: z.array(contactoSchema),
  puntosDeEntrega: z.array(puntoDeEntregaSchema),
  nombreLegal: z.string().min(1),
  rfc: z.string().refine(
    (rfc) => {
      return validateRfc(rfc).isValid;
    },
    { message: 'RFC inválido' },
  ),
  usoDeCfdi: z.nativeEnum(UsoDeCFDI),
  regimenFiscal: z.nativeEnum(RegimenFiscal),
  idTributario: z.string(),
  cuentaContable: z.nativeEnum(CuentaContable),
  formaDePago: z.nativeEnum(FormaDePago),
  topeDeCredito: z.number().nonnegative().multipleOf(0.01),
  descuento: z.number().nonnegative().multipleOf(0.01),
  diasACredito: z.number().nonnegative().int(),
  esPrecioEspecial: z.boolean(),
  preciosEspeciales: z.array(precioEspecialSchema),
});

export type ClienteSchema = z.infer<typeof clienteSchema>;

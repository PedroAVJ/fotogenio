import { z } from '@/lib/es-zod';

const choferSchema = z
  .object({
    id: z.string(),
    nombreCompleto: z.string(),
  })
  .nullable();

export const vehiculoSchema = z.object({
  divisionId: z.string().min(1, 'La división es requerida'),
  codigo: z.string().min(1),
  descripcion: z.string().min(1),
  chofer: choferSchema,
  tipoDeOdometro: z.nativeEnum(TipoDeOdometro),
  tipoDeVehiculo: z.nativeEnum(TipoDeVehiculo),
  identificadorDeGps: z.string().min(1),
  tipoDeCombustible: z.nativeEnum(TipoDeCombustible),
  numeroDePolizaDeSeguro: z.string().min(1),
  fechaDeExpiracionDePolizaDeSeguro: z.date(),
  horometraje: z.number().nonnegative(),
});

export type VehiculoSchema = z.infer<typeof vehiculoSchema>;

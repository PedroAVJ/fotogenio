import { z } from '@/lib/es-zod';

const puntoDeEntregaSchema = z
  .object({
    id: z.string(),
    formattedAddress: z.string(),
  })
  .refine((puntoDeEntrega) => puntoDeEntrega.id.length > 0, {
    message: 'El punto de entrega es requerido',
  });

const paradaSchema = z.object({
  lunes: z.boolean(),
  martes: z.boolean(),
  miercoles: z.boolean(),
  jueves: z.boolean(),
  viernes: z.boolean(),
  sabado: z.boolean(),
  domingo: z.boolean(),
  visitOrder: z.number(),
  puntoDeEntrega: puntoDeEntregaSchema,
});

export const rutaSchema = z.object({
  divisionId: z.string().min(1, 'La división es requerida'),
  nombre: z.string().min(1),
  paradas: z.array(paradaSchema),
});

export type RutaSchema = z.infer<typeof rutaSchema>;

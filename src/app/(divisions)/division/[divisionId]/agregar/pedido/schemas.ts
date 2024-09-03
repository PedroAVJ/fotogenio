import { z } from '@/lib/es-zod';

const articuloSchema = z.object({
  cantidad: z.number().min(0.01).multipleOf(0.01),
  producto: z
    .object({
      id: z.string(),
      codigo: z.string(),
      descripcion: z.string(),
    })
    .refine((data) => data.id.length > 0, {
      message: 'El producto es requerido',
    }),
  precioUnitario: z.number(),
  tasaDeIva: z.number(),
  retencionDeIva: z.number(),
  retencionDeIsr: z.number(),
  tasaDeIeps: z.number(),
});

const puntoDeEntregaSchema = z
  .object({
    id: z.string(),
    clienteId: z.string(),
    formattedAddress: z.string(),
  })
  .refine((puntoDeEntrega) => puntoDeEntrega.id.length > 0, {
    message: 'El punto de entrega es requerido',
  });

export const pedidoSchema = z.object({
  divisionId: z.string().min(1, 'La división es requerida'),
  puntoDeEntrega: puntoDeEntregaSchema,
  fechaDeEntrega: z.date(),
  articulos: z.array(articuloSchema),
});

export type PedidoSchema = z.infer<typeof pedidoSchema>;

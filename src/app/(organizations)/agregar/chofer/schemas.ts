import { z } from '@/lib/es-zod';

export const choferSchema = z.object({
  codigo: z.string().min(1),
  nombreCompleto: z.string().min(1),
  numeroDeLicencia: z.string().min(1),
  fechaDeExpiracionDeLicencia: z.date(),
});

export type ChoferSchema = z.infer<typeof choferSchema>;

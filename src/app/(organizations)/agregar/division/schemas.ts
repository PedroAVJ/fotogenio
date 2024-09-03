import { z } from '@/lib/es-zod';

export const divisionSchema = z.object({
  nombre: z.string().min(1),
});

export type DivisionSchema = z.infer<typeof divisionSchema>;

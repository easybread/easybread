import { z } from 'zod';

export const DtoByIdSchema = z.object({
  id: z.string(),
});

export type DtoById = z.infer<typeof DtoByIdSchema>;

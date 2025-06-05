import { z } from 'zod';

import { DtoConnectionSchema } from './DtoConnection';

const { type, name } = DtoConnectionSchema.shape;

export const DtoConnectionCreateSchema = z.object({
  name,
  type,
});

export type DtoConnectionCreate = z.infer<typeof DtoConnectionCreateSchema>;

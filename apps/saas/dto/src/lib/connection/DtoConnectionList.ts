import { z } from 'zod';

import { DtoConnectionSchema } from './DtoConnection';

export const DtoConnectionListSchema = z.object({
  data: z.array(DtoConnectionSchema),
});

export type DtoConnectionList = z.infer<typeof DtoConnectionListSchema>;

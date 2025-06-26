import { z } from 'zod';

export const DtoDataModelSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  connectionId: z.string(),
  version: z.number(),
  name: z.string(),
  namespaces: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
  def: z.any(),
});

export type DtoDataModel = z.infer<typeof DtoDataModelSchema>;

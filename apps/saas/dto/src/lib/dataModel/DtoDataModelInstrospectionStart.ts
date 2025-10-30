import { z } from 'zod';

export const DtoDataModelInstrospectionStartSchema = z.object({
  connectionId: z.string(),
});

export type DtoDataModelInstrospectionStart = z.infer<
  typeof DtoDataModelInstrospectionStartSchema
>;

import { z } from 'zod';

import { DtoConnectionSettingsSchema } from './DtoConnectionSettings';

export const DtoConnectionSettingsUpdateSchema = z.object({
  id: z.string(),
  settings: DtoConnectionSettingsSchema,
  name: z.string().optional(),
});

export type DtoConnectionSettingsUpdate = z.infer<
  typeof DtoConnectionSettingsUpdateSchema
>;

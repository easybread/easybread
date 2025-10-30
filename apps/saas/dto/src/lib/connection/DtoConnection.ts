import { z } from 'zod';

import { PG_CONNECTION_TYPE } from 'saas-db/enums';

import { DtoConnectionSettingsSchema } from './DtoConnectionSettings';

export const DtoConnectionSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  name: z.string().nullable(),
  type: z.union([
    z.literal(PG_CONNECTION_TYPE.DB_PG),
    z.literal(PG_CONNECTION_TYPE.DB_MYSQL),
    z.literal(PG_CONNECTION_TYPE.DB_MONGO),
    z.literal(PG_CONNECTION_TYPE.EB_BAMBOO),
    z.literal(PG_CONNECTION_TYPE.EB_BREEZY),
    z.literal(PG_CONNECTION_TYPE.EB_GOOGLE_ADMIN_DIRECTORY),
    z.literal(PG_CONNECTION_TYPE.EB_GOOGLE_CONTACTS),
    z.literal(PG_CONNECTION_TYPE.EB_ROCKET_CHAT_USERS),
  ]),
  settings: DtoConnectionSettingsSchema.nullable(),
  isConnected: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type DtoConnection = z.infer<typeof DtoConnectionSchema>;

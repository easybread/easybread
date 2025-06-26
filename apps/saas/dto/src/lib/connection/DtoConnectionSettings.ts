import { z } from 'zod';

import {
  PG_CONNECTION_SETTINGS_BAMBOO_AUTH_STRATEGY,
  PG_CONNECTION_TYPE,
} from 'saas-db/enums';

export const DtoConnectionSettingsSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(PG_CONNECTION_TYPE.DB_PG),
    connectionString: z.string().url(),
  }),
  z.object({
    type: z.literal(PG_CONNECTION_TYPE.DB_MYSQL),
    connectionString: z.string().url(),
  }),
  z.object({
    type: z.literal(PG_CONNECTION_TYPE.DB_MONGO),
    connectionString: z.string().url(),
  }),
  z.object({
    type: z.literal(PG_CONNECTION_TYPE.EB_BREEZY),
  }),
  z.object({
    type: z.literal(PG_CONNECTION_TYPE.EB_BAMBOO),
    authStrategy: z.union([
      z.literal(PG_CONNECTION_SETTINGS_BAMBOO_AUTH_STRATEGY.OIDC),
      z.literal(PG_CONNECTION_SETTINGS_BAMBOO_AUTH_STRATEGY.CREDENTIALS),
    ]),
  }),
  z.object({
    type: z.literal(PG_CONNECTION_TYPE.EB_GOOGLE_CONTACTS),
  }),
  z.object({
    type: z.literal(PG_CONNECTION_TYPE.EB_GOOGLE_ADMIN_DIRECTORY),
  }),
]);

export type DtoConnectionSettings = z.infer<typeof DtoConnectionSettingsSchema>;

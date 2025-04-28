import { z } from 'zod';

import {
  PG_CONNECTION_SETTINGS_BAMBOO_AUTH_STRATEGY,
  PG_CONNECTION_TYPE,
} from 'saas-pg/enums';

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
  settings: z
    .discriminatedUnion('type', [
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
    ])
    .nullable(),
  isConnected: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type DtoConnection = z.infer<typeof DtoConnectionSchema>;

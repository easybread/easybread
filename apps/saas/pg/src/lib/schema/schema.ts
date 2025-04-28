import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import type { ConnectionSettingsJsonb } from '../jsonb/ConnectionSettingsJsonb';
import { uuidV7 } from '../util/uuidv7';

export const users = pgTable('users', {
  id: uuidV7('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuidV7('id').primaryKey(),
  userId: uuidV7('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  memberOf: jsonb().$type<string[]>(),
  defaultOrg: text('defaultOrg'),
  token: text('token').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const accounts = pgTable('accounts', {
  id: uuidV7('id').primaryKey(),
  userId: uuidV7('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  idToken: text('idToken'),
  password: text('password'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const verifications = pgTable('verifications', {
  id: uuidV7('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value'),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const organizations = pgTable('organizations', {
  id: uuidV7('id').primaryKey(),
  name: text('name').notNull().default('Default'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const usersToOrganizations = pgTable(
  'users_to_organizations',
  {
    userId: uuidV7('userId')
      .notNull()
      .references(() => users.id),
    organizationId: uuidV7('organizationId')
      .notNull()
      .references(() => organizations.id),
    isDefault: boolean('isDefault').notNull().default(false),
  },
  t => [{ pk: primaryKey({ columns: [t.userId, t.organizationId] }) }],
);

// -----------------------------------------------------------------------------

export const connectionTypeEnum = pgEnum('connection_type', [
  'DB_PG',
  'DB_MYSQL',
  'DB_MONGO',
  'EB_BREEZY',
  'EB_BAMBOO',
  'EB_GOOGLE_ADMIN_DIRECTORY',
  'EB_GOOGLE_CONTACTS',
  'EB_ROCKET_CHAT_USERS',
]);

export const connections = pgTable('connections', {
  id: uuidV7('id').primaryKey(),
  organizationId: uuidV7('organizationId')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: text(),
  type: connectionTypeEnum().notNull(),
  settings: jsonb('value').$type<ConnectionSettingsJsonb>(),
  isConnected: boolean().notNull().default(false),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

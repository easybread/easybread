import { connections, users } from './schema/schema';

export type PgUserSelect = typeof users.$inferSelect;

export type PgConnectionSelect = typeof connections.$inferSelect;
export type PgConnectionInsert = typeof connections.$inferInsert;

export type {
  ConnectionSettingsJsonb,
  ConnectionSettingsJsonb_DbMongo,
  ConnectionSettingsJsonb_DbMySql,
  ConnectionSettingsJsonb_DbPg,
  ConnectionSettingsJsonb_EbBamboo,
  ConnectionSettingsJsonb_EbBreezy,
  ConnectionSettingsJsonb_EbGoogleAD,
  ConnectionSettingsJsonb_EbGoogleContacts,
} from './jsonb/ConnectionSettingsJsonb';

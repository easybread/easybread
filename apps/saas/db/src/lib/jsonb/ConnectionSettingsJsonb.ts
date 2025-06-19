import type { PgConnectionSettingsBambooAuthStrategy } from '../enums';
import { PG_CONNECTION_TYPE } from '../enums';

export type ConnectionSettingsJsonb_DbPg = {
  type: typeof PG_CONNECTION_TYPE.DB_PG;
  connectionString: string;
};
export type ConnectionSettingsJsonb_DbMySql = {
  type: typeof PG_CONNECTION_TYPE.DB_MYSQL;
  connectionString: string;
};

export type ConnectionSettingsJsonb_DbMongo = {
  type: typeof PG_CONNECTION_TYPE.DB_MONGO;
  connectionString: string;
};

export type ConnectionSettingsJsonb_EbBamboo = {
  type: typeof PG_CONNECTION_TYPE.EB_BAMBOO;
  authStrategy: PgConnectionSettingsBambooAuthStrategy;
};

export type ConnectionSettingsJsonb_EbBreezy = {
  type: typeof PG_CONNECTION_TYPE.EB_BREEZY;
};

export type ConnectionSettingsJsonb_EbGoogleContacts = {
  type: typeof PG_CONNECTION_TYPE.EB_GOOGLE_CONTACTS;
};

export type ConnectionSettingsJsonb_EbGoogleAD = {
  type: typeof PG_CONNECTION_TYPE.EB_GOOGLE_ADMIN_DIRECTORY;
};

export type ConnectionSettingsJsonb =
  | ConnectionSettingsJsonb_DbPg
  | ConnectionSettingsJsonb_DbMySql
  | ConnectionSettingsJsonb_DbMongo
  | ConnectionSettingsJsonb_EbBreezy
  | ConnectionSettingsJsonb_EbBamboo
  | ConnectionSettingsJsonb_EbGoogleContacts
  | ConnectionSettingsJsonb_EbGoogleAD;

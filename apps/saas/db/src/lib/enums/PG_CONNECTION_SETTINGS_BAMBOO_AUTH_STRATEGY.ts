import { type ValueOf, enumObject } from '@easybread/common';

export const PG_CONNECTION_SETTINGS_BAMBOO_AUTH_STRATEGY = enumObject([
  'OIDC',
  'CREDENTIALS',
] as const);

export type PgConnectionSettingsBambooAuthStrategy = ValueOf<
  typeof PG_CONNECTION_SETTINGS_BAMBOO_AUTH_STRATEGY
>;

import { type ValueOf, enumPrefixed } from '@easybread/common';

export const DB_ERROR = enumPrefixed('DB', [
  'QUERY_FAILED',
  'NOT_FOUND',
  'UNEXPECTED_EMPTY_RETURN_ARRAY',
] as const);

export type DBError = ValueOf<typeof DB_ERROR>;

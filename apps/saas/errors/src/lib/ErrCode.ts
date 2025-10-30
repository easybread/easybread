import {
  enumMerge,
  enumPrefixed,
  enumSuiteObject,
} from '@space-architects/util-enum';

export const ERR_CODE = enumSuiteObject(
  enumMerge(
    enumPrefixed('CORE', ['OWNERSHIP_VIOLATION', 'UNKNOWN_ERROR']),

    enumPrefixed('DB', [
      'QUERY_FAILED',
      'NOT_FOUND',
      'UNEXPECTED_EMPTY_RETURN_ARRAY',
    ]),

    enumPrefixed('CONNECTIONS', ['NO_SETTINGS', 'UNSUPPORTED_TYPE']),

    enumPrefixed('DATA_MODEL', ['INTROSPECTION_FAILED']),
  ),
);

export type ErrCode = typeof ERR_CODE.$type;

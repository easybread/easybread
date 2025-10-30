import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

import { countryCodeEnum } from '../schema/enums';

export const CONTRY_CODE_ENUM_SUITE = enumSuiteObject(
  enumObject(countryCodeEnum.enumValues),
);

export type CountryCodeEnum = typeof CONTRY_CODE_ENUM_SUITE.$type;

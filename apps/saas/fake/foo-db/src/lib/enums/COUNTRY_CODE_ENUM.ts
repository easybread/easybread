import {
  type EnumInferFromObject,
  enumObject,
  enumSuiteObject,
} from '@space-architects/util-enum';

import { countryCodeEnum } from '../schema/schema';

export const CONTRY_CODE_ENUM_SUITE = enumSuiteObject(
  enumObject(countryCodeEnum.enumValues),
);

export type CountryCodeEnum = EnumInferFromObject<
  typeof CONTRY_CODE_ENUM_SUITE.enum
>;

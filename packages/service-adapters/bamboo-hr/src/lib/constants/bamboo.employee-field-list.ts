import { enumObject } from '@easybread/common';

import type { BambooEmployeeField } from '../interfaces';

export const BAMBOO_EMPLOYEE_FIELD = enumObject([
  'avatar',
  'canUploadPhoto',
  'department',
  'displayName',
  'division',
  'firstName',
  'gender',
  'jobTitle',
  'lastName',
  'linkedIn',
  'location',
  'mobilePhone',
  'photoUploaded',
  'photoUrl',
  'preferredName',
  'skypeUsername',
  'workEmail',
  'workPhone',
  'workPhoneExtension',
  // line below makes sure that all and only fields are included in the list
] as const) satisfies Record<BambooEmployeeField, string>;

export const BAMBOO_EMPLOYEE_FIELD_LIST = Object.values(BAMBOO_EMPLOYEE_FIELD);

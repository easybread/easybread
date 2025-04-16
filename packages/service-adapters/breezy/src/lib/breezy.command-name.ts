import { BREAD_COMMAND_NAME } from '@easybread/commands';
import { enumPickKeys } from '@easybread/common';

export const BREEZY_COMMAND_NAME = enumPickKeys(BREAD_COMMAND_NAME, [
  'AUTH_BASIC_SET',
  'HR_ORGANIZATION_SEARCH',
  'HR_JOB_APPLICANT_SEARCH',
]);

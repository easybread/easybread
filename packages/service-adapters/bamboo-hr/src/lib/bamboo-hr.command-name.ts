import { BREAD_COMMAND_NAME } from '@easybread/commands';
import { enumPickKeys } from '@easybread/common';

export const BAMBOO_HR_COMMAND_NAME = enumPickKeys(BREAD_COMMAND_NAME, [
  'AUTH_OIDC_START',
  'AUTH_OIDC_COMPLETE',
  'AUTH_BASIC_SET',
  'HR_EMPLOYEE_SEARCH',
  'HR_EMPLOYEE_BY_ID',
  'HR_EMPLOYEE_CREATE',
  'HR_EMPLOYEE_UPDATE',
  'HR_JOB_APPLICATION_SEARCH',
  'HR_JOB_APPLICANT_SEARCH',
]);

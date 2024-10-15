import { BreadOperationName } from '@easybread/operations';

export enum BambooHrOperationName {
  EMPLOYEE_SEARCH = BreadOperationName.EMPLOYEE_SEARCH,
  EMPLOYEE_BY_ID = BreadOperationName.EMPLOYEE_BY_ID,
  EMPLOYEE_CREATE = BreadOperationName.EMPLOYEE_CREATE,
  EMPLOYEE_UPDATE = BreadOperationName.EMPLOYEE_UPDATE,
  SETUP_BASIC_AUTH = BreadOperationName.SETUP_BASIC_AUTH,
  JOB_APPLICATION_SEARCH = BreadOperationName.JOB_APPLICATION_SEARCH,
  JOB_APPLICANT_SEARCH = BreadOperationName.JOB_APPLICANT_SEARCH,
}

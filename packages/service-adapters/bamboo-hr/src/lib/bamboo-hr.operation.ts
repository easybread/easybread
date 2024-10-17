import {
  type EmployeeByIdOperation,
  type EmployeeCreateOperation,
  type EmployeeSearchOperation,
  type EmployeeUpdateOperation,
  type JobApplicantSearchOperation,
  type JobApplicationSearchOperation,
  type SetupBasicAuthOperation,
} from '@easybread/operations';

import {
  type BambooApplicationList,
  type BambooBasicAuthPayload,
  type BambooEmployee,
  type BambooEmployeesDirectory,
} from './interfaces';

export type BambooHrSetupBasicAuthOperation =
  SetupBasicAuthOperation<BambooBasicAuthPayload>;

export type BambooHrEmployeeSearchOperation =
  EmployeeSearchOperation<BambooEmployeesDirectory>;

export type BambooHrEmployeeByIdOperation =
  EmployeeByIdOperation<BambooEmployee>;

export type BambooHrEmployeeCreateOperation = EmployeeCreateOperation;

export type BambooHrEmployeeUpdateOperation = EmployeeUpdateOperation;

export type BambooHrJobApplicationSearchOperation =
  JobApplicationSearchOperation<BambooApplicationList, 'PREV_NEXT'>;

export type BambooHrJobApplicantSearchOperation = JobApplicantSearchOperation<
  BambooApplicationList,
  'PREV_NEXT'
>;

export type BambooHrOperation =
  | BambooHrEmployeeSearchOperation
  | BambooHrEmployeeByIdOperation
  | BambooHrEmployeeCreateOperation
  | BambooHrEmployeeUpdateOperation
  | BambooHrSetupBasicAuthOperation
  | BambooHrJobApplicantSearchOperation
  | BambooHrJobApplicationSearchOperation;

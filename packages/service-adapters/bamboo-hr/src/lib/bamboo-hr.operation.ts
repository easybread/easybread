import {
  EmployeeByIdOperation,
  EmployeeCreateOperation,
  EmployeeSearchOperation,
  EmployeeUpdateOperation,
  SetupBasicAuthOperation,
} from '@easybread/operations';

import {
  BambooBasicAuthPayload,
  BambooEmployee,
  BambooEmployeesDirectory,
} from './interfaces';

export type BambooHrSetupBasicAuthOperation =
  SetupBasicAuthOperation<BambooBasicAuthPayload>;

export type BambooHrEmployeeSearchOperation =
  EmployeeSearchOperation<BambooEmployeesDirectory>;

export type BambooHrEmployeeByIdOperation =
  EmployeeByIdOperation<BambooEmployee>;

export type BambooHrEmployeeCreateOperation = EmployeeCreateOperation;

export type BambooHrEmployeeUpdateOperation = EmployeeUpdateOperation;

export type BambooHrOperation =
  | BambooHrEmployeeSearchOperation
  | BambooHrEmployeeByIdOperation
  | BambooHrEmployeeCreateOperation
  | BambooHrEmployeeUpdateOperation
  | BambooHrSetupBasicAuthOperation;

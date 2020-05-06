import {
  EmployeeByIdOperation,
  EmployeeCreateOperation,
  EmployeeSearchOperation,
  EmployeeUpdateOperation,
  SetupBasicAuthOperation
} from '@easybread/operations';

import {
  BambooBasicAuthPayload,
  BambooEmployee,
  BambooEmployeesDirectory
} from './interfaces';

export type BambooHrOperation =
  | SetupBasicAuthOperation<BambooBasicAuthPayload>
  | EmployeeSearchOperation<BambooEmployeesDirectory>
  | EmployeeByIdOperation<BambooEmployee>
  | EmployeeCreateOperation
  | EmployeeUpdateOperation;

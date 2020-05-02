import {
  EmployeeCreateOperation,
  EmployeeSearchOperation,
  EmployeeUpdateOperation,
  SetupBasicAuthOperation
} from '@easybread/operations';

import { BambooBasicAuthPayload, BambooEmployeesDirectory } from './interfaces';

export type BambooHrOperation =
  | SetupBasicAuthOperation<BambooBasicAuthPayload>
  | EmployeeSearchOperation<BambooEmployeesDirectory>
  | EmployeeCreateOperation
  | EmployeeUpdateOperation;

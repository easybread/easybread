import {
  EmployeeSearchOperation,
  SetupBasicAuthOperation
} from '@easybread/operations';

import { BambooBasicAuthPayload, BambooEmployeesDirectory } from './interfaces';

export type BambooHrOperation =
  | SetupBasicAuthOperation<BambooBasicAuthPayload>
  | EmployeeSearchOperation<BambooEmployeesDirectory>;

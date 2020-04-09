import {
  EmployeeSearchOperation,
  SetupBasicAuthOperation
} from '../../operations';
import { BambooBasicAuthPayload } from './interfaces';

export type BambooHrOperation =
  | SetupBasicAuthOperation<BambooBasicAuthPayload>
  | EmployeeSearchOperation;

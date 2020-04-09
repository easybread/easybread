import { Person } from 'schema-dts';

import { BambooEmployeesDirectory } from '../../example/bamboo-hr/interfaces';
import {
  BreadOperation,
  BreadOperationInputWithParams,
  BreadOperationName,
  BreadOperationOutputWithRawDataAndPayload
} from '../../operation';

export interface EmployeeSearchOperation
  extends BreadOperation<BreadOperationName.EMPLOYEE_SEARCH> {
  name: BreadOperationName.EMPLOYEE_SEARCH;
  input: BreadOperationInputWithParams<
    BreadOperationName.EMPLOYEE_SEARCH,
    Person
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    BreadOperationName.EMPLOYEE_SEARCH,
    BambooEmployeesDirectory,
    Person[]
  >;
}

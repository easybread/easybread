import {
  BreadOperation,
  BreadOperationInputWithParams,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { Person } from 'schema-dts';

import { BreadOperationName } from '../bread.operation-name';

export interface EmployeeSearchOperation<T extends object = {}>
  extends BreadOperation<BreadOperationName.EMPLOYEE_SEARCH> {
  name: BreadOperationName.EMPLOYEE_SEARCH;
  input: BreadOperationInputWithParams<
    BreadOperationName.EMPLOYEE_SEARCH,
    Person
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    BreadOperationName.EMPLOYEE_SEARCH,
    T,
    Person[]
  >;
}
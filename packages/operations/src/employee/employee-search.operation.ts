import {
  BreadOperation,
  BreadOperationInputWithParams,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { BreadOperationName } from '../bread.operation-name';
import { EmployeeSearchOperationInputParams } from './employee-search.operation.input-params';

export interface EmployeeSearchOperation<T extends object = {}>
  extends BreadOperation<BreadOperationName.EMPLOYEE_SEARCH> {
  name: BreadOperationName.EMPLOYEE_SEARCH;
  input: BreadOperationInputWithParams<
    BreadOperationName.EMPLOYEE_SEARCH,
    EmployeeSearchOperationInputParams
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    BreadOperationName.EMPLOYEE_SEARCH,
    T,
    PersonSchema[]
  >;
}

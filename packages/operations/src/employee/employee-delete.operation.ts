import {
  BreadOperation,
  BreadOperationInputWithParams,
  BreadOperationOutputWithRawData
} from '@easybread/core';

import { BreadOperationName } from '../bread.operation-name';

export interface EmployeeDeleteOperation
  extends BreadOperation<BreadOperationName.EMPLOYEE_DELETE> {
  input: BreadOperationInputWithParams<
    BreadOperationName.EMPLOYEE_DELETE,
    { identifier: string }
  >;

  output: BreadOperationOutputWithRawData<
    BreadOperationName.EMPLOYEE_DELETE,
    { identifier: string }
  >;
}
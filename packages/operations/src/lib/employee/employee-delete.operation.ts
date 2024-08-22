import {
  BreadOperationInputWithParams,
  BreadOperationOutputWithRawData,
  BreadStandardOperation
} from '@easybread/core';

import { BreadOperationName } from '../bread.operation-name';

export interface EmployeeDeleteOperation
  extends BreadStandardOperation<BreadOperationName.EMPLOYEE_DELETE> {
  input: BreadOperationInputWithParams<
    BreadOperationName.EMPLOYEE_DELETE,
    // TODO: consider using schema entity here as well
    { identifier: string }
  >;

  output: BreadOperationOutputWithRawData<
    BreadOperationName.EMPLOYEE_DELETE,
    // TODO: consider using schema entity here as well
    { identifier: string }
  >;
}

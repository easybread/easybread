import {
  BreadOperation,
  BreadOperationInput,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { BreadOperationName } from '../bread.operation-name';

export interface EmployeeSearchOperation<T extends object = {}>
  extends BreadOperation<BreadOperationName.EMPLOYEE_SEARCH> {
  name: BreadOperationName.EMPLOYEE_SEARCH;
  input: BreadOperationInput<BreadOperationName.EMPLOYEE_SEARCH>;
  output: BreadOperationOutputWithRawDataAndPayload<
    BreadOperationName.EMPLOYEE_SEARCH,
    T,
    PersonSchema[]
  >;
}

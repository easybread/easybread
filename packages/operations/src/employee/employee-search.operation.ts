import {
  BreadCollectionOperation,
  BreadCollectionOperationInputWithParams,
  BreadCollectionOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { BreadOperationName } from '../bread.operation-name';
import { EmployeeSearchOperationInputParams } from './employee-search.operation.input-params';

export interface EmployeeSearchOperation<T extends object = {}>
  extends BreadCollectionOperation<BreadOperationName.EMPLOYEE_SEARCH> {
  name: BreadOperationName.EMPLOYEE_SEARCH;
  input: BreadCollectionOperationInputWithParams<
    BreadOperationName.EMPLOYEE_SEARCH,
    EmployeeSearchOperationInputParams
  >;
  output: BreadCollectionOperationOutputWithRawDataAndPayload<
    BreadOperationName.EMPLOYEE_SEARCH,
    T,
    PersonSchema[]
  >;
}

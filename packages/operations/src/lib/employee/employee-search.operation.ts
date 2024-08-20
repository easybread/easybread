import {
  BreadCollectionOperation,
  BreadCollectionOperationInputWithParams,
  BreadCollectionOperationOutputWithRawDataAndPayload,
  BreadOperationPaginationType,
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { BreadOperationName } from '../bread.operation-name';
import { EmployeeSearchOperationInputParams } from './employee-search.operation.input-params';

export interface EmployeeSearchOperation<
  T extends object = object,
  TPaginationType extends BreadOperationPaginationType = 'DISABLED'
> extends BreadCollectionOperation<
    BreadOperationName.EMPLOYEE_SEARCH,
    TPaginationType
  > {
  name: BreadOperationName.EMPLOYEE_SEARCH;
  input: BreadCollectionOperationInputWithParams<
    BreadOperationName.EMPLOYEE_SEARCH,
    EmployeeSearchOperationInputParams,
    TPaginationType
  >;
  output: BreadCollectionOperationOutputWithRawDataAndPayload<
    BreadOperationName.EMPLOYEE_SEARCH,
    T,
    PersonSchema[],
    TPaginationType
  >;
}

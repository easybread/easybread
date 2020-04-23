import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { Person } from 'schema-dts';

import { BreadOperationName } from '../bread.operation-name';

export interface EmployeeCreateOperation<TOutputRawData extends object = {}>
  extends BreadOperation<BreadOperationName.EMPLOYEE_CREATE> {
  input: BreadOperationInputWithPayload<
    BreadOperationName.EMPLOYEE_CREATE,
    Person
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    BreadOperationName.EMPLOYEE_CREATE,
    TOutputRawData,
    Person
  >;
}

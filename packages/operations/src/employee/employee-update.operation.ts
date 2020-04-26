import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { Person } from 'schema-dts';

import { BreadOperationName } from '../bread.operation-name';

export interface EmployeeUpdateOperation<TOutputRawData extends object = {}>
  extends BreadOperation<BreadOperationName.EMPLOYEE_UPDATE> {
  input: BreadOperationInputWithPayload<
    BreadOperationName.EMPLOYEE_UPDATE,
    Person
  >;

  output: BreadOperationOutputWithRawDataAndPayload<
    BreadOperationName.EMPLOYEE_UPDATE,
    TOutputRawData,
    Person
  >;
}

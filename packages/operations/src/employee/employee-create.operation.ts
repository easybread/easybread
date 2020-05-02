import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { BreadOperationName } from '../bread.operation-name';

export interface EmployeeCreateOperation<TOutputRawData extends object = {}>
  extends BreadOperation<BreadOperationName.EMPLOYEE_CREATE> {
  input: BreadOperationInputWithPayload<
    BreadOperationName.EMPLOYEE_CREATE,
    PersonSchema
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    BreadOperationName.EMPLOYEE_CREATE,
    TOutputRawData,
    PersonSchema
  >;
}

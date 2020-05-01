import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { BreadOperationName } from '../bread.operation-name';

export interface EmployeeUpdateOperation<TOutputRawData extends object = {}>
  extends BreadOperation<BreadOperationName.EMPLOYEE_UPDATE> {
  input: BreadOperationInputWithPayload<
    BreadOperationName.EMPLOYEE_UPDATE,
    PersonSchema
  >;

  output: BreadOperationOutputWithRawDataAndPayload<
    BreadOperationName.EMPLOYEE_UPDATE,
    TOutputRawData,
    PersonSchema
  >;
}

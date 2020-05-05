import {
  BreadOperation,
  BreadOperationInputWithParams,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { BreadSchema, PersonSchema } from '@easybread/schemas';

import { BreadOperationName } from '../bread.operation-name';

export interface EmployeeByIdOperation<TOutputRawData extends object = {}>
  extends BreadOperation<BreadOperationName.EMPLOYEE_UPDATE> {
  input: BreadOperationInputWithParams<
    BreadOperationName.EMPLOYEE_UPDATE,
    // TODO: come up with an interface for that
    Pick<BreadSchema, 'identifier'>
  >;

  output: BreadOperationOutputWithRawDataAndPayload<
    BreadOperationName.EMPLOYEE_UPDATE,
    TOutputRawData,
    PersonSchema
  >;
}

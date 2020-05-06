import {
  BreadOperation,
  BreadOperationInputWithParams,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { BreadSchema, PersonSchema } from '@easybread/schemas';

import { BreadOperationName } from '../bread.operation-name';

export interface EmployeeByIdOperation<TOutputRawData extends object = {}>
  extends BreadOperation<BreadOperationName.EMPLOYEE_BY_ID> {
  input: BreadOperationInputWithParams<
    BreadOperationName.EMPLOYEE_BY_ID,
    // TODO: come up with an interface for that
    Pick<BreadSchema, 'identifier'>
  >;

  output: BreadOperationOutputWithRawDataAndPayload<
    BreadOperationName.EMPLOYEE_BY_ID,
    TOutputRawData,
    PersonSchema
  >;
}

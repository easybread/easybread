import {
  BreadOperationInputWithParams,
  BreadOperationOutputWithRawDataAndPayload,
  BreadStandardOperation,
} from '@easybread/core';
import { PersonSchema, ThingSchema } from '@easybread/schemas';

import { BreadOperationName } from '../bread.operation-name';

export interface EmployeeByIdOperation<TOutputRawData extends object = object>
  extends BreadStandardOperation<BreadOperationName.EMPLOYEE_BY_ID> {
  input: BreadOperationInputWithParams<
    BreadOperationName.EMPLOYEE_BY_ID,
    // TODO: come up with an interface for that
    Pick<ThingSchema, 'identifier'>
  >;

  output: BreadOperationOutputWithRawDataAndPayload<
    BreadOperationName.EMPLOYEE_BY_ID,
    TOutputRawData,
    PersonSchema
  >;
}

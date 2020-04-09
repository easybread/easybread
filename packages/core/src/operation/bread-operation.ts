import { Thing } from 'schema-dts';

import {
  BreadOperationInput,
  BreadOperationInputWithParams,
  BreadOperationInputWithParamsAndPayload,
  BreadOperationInputWithPayload
} from './bread-operation-input';
import {
  BreadOperationOutput,
  BreadOperationOutputWithPayload,
  BreadOperationOutputWithRawData,
  BreadOperationOutputWithRawDataAndPayload
} from './bread-operation-output';

export interface BreadOperation<T extends string> {
  name: T;
  input:
    | BreadOperationInput<T>
    | BreadOperationInputWithParams<T, object | Thing>
    | BreadOperationInputWithPayload<T, object | object[] | Thing[] | Thing>
    | BreadOperationInputWithParamsAndPayload<
        T,
        object | Thing,
        object | object[] | Thing[] | Thing
      >;
  output:
    | BreadOperationOutput<T>
    | BreadOperationOutputWithRawData<T, object>
    | BreadOperationOutputWithPayload<T, Thing | Thing[]>
    | BreadOperationOutputWithRawDataAndPayload<T, object, Thing | Thing[]>;
}

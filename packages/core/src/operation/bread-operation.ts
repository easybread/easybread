import { BreadSchema } from '@easybread/schemas';

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
    | BreadOperationInputWithParams<T, object>
    | BreadOperationInputWithPayload<T, object | BreadSchema | BreadSchema[]>
    | BreadOperationInputWithParamsAndPayload<
        T,
        object,
        object | BreadSchema | BreadSchema[]
      >;
  output:
    | BreadOperationOutput<T>
    | BreadOperationOutputWithRawData<T, object>
    | BreadOperationOutputWithPayload<T, BreadSchema | BreadSchema[]>
    | BreadOperationOutputWithRawDataAndPayload<
        T,
        object,
        BreadSchema | BreadSchema[]
      >;
}

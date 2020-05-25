import { BreadSchema } from '@easybread/schemas';

import {
  BreadCollectionOperationInput,
  BreadCollectionOperationInputWithParams,
  BreadCollectionOperationInputWithParamsAndPayload,
  BreadCollectionOperationInputWithPayload,
  BreadOperationInput,
  BreadOperationInputWithParams,
  BreadOperationInputWithParamsAndPayload,
  BreadOperationInputWithPayload
} from './bread-operation-input';
import {
  BreadCollectionOperationOutputWithPayload,
  BreadCollectionOperationOutputWithRawDataAndPayload,
  BreadOperationOutput,
  BreadOperationOutputWithPayload,
  BreadOperationOutputWithRawData,
  BreadOperationOutputWithRawDataAndPayload
} from './bread-operation-output';

export interface BreadStandardOperation<T extends string> {
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
    | BreadOperationOutputWithPayload<T, BreadSchema>
    | BreadOperationOutputWithRawDataAndPayload<T, object, BreadSchema>;
}

// The idea is that if the operation returns a collection,
// then it should use specific interfaces designed for that.
export interface BreadCollectionOperation<T extends string> {
  name: T;
  input:
    | BreadCollectionOperationInput<T>
    | BreadCollectionOperationInputWithParams<T, object>
    | BreadCollectionOperationInputWithPayload<
        T,
        object | BreadSchema | BreadSchema[]
      >
    | BreadCollectionOperationInputWithParamsAndPayload<
        T,
        object,
        object | BreadSchema | BreadSchema[]
      >;
  output:
    | BreadCollectionOperationOutputWithPayload<T, BreadSchema[]>
    | BreadCollectionOperationOutputWithRawDataAndPayload<
        T,
        object,
        BreadSchema[]
      >;
}

export type BreadOperation<T extends string> =
  | BreadStandardOperation<T>
  | BreadCollectionOperation<T>;

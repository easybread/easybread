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
import { BreadOperationPaginationType } from './bread-operation-pagination';

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

// ------------------------------------
// COLLECTION OPERATIONS
//
// The idea is that if the operation returns a collection,
// then it should use specific interfaces designed for that.
// ------------------------------------

export interface BreadCollectionOperation<
  T extends string,
  P extends BreadOperationPaginationType
> {
  name: T;
  input:
    | BreadCollectionOperationInput<T, P>
    | BreadCollectionOperationInputWithParams<T, object, P>
    | BreadCollectionOperationInputWithPayload<
        T,
        object | BreadSchema | BreadSchema[],
        P
      >
    | BreadCollectionOperationInputWithParamsAndPayload<
        T,
        object,
        object | BreadSchema | BreadSchema[],
        P
      >;

  output:
    | BreadCollectionOperationOutputWithPayload<T, BreadSchema[], P>
    | BreadCollectionOperationOutputWithRawDataAndPayload<
        T,
        object,
        BreadSchema[],
        P
      >;
}

export type BreadOperation<T extends string> =
  | BreadStandardOperation<T>
  | BreadCollectionOperation<T, BreadOperationPaginationType>;

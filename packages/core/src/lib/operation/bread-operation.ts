import { BreadSchema } from '@easybread/schemas';

import {
  BreadCollectionOperationInput,
  BreadCollectionOperationInputWithParams,
  BreadCollectionOperationInputWithParamsAndPayload,
  BreadCollectionOperationInputWithPayload,
  BreadOperationInput,
  BreadOperationInputWithParams,
  BreadOperationInputWithParamsAndPayload,
  BreadOperationInputWithPayload,
} from './bread-operation-input';
import {
  BreadCollectionOperationOutputWithPayload,
  BreadCollectionOperationOutputWithRawDataAndPayload,
  BreadOperationOutput,
  BreadOperationOutputWithPayload,
  BreadOperationOutputWithRawData,
  BreadOperationOutputWithRawDataAndPayload,
} from './bread-operation-output';
import { BreadOperationPaginationType } from './bread-operation-pagination';

export interface BreadStandardOperation<T extends string, E = any> {
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

  error: E;
}

// ------------------------------------
// COLLECTION OPERATIONS
//
// The idea is that if the operation returns a collection,
// then it should use specific interfaces designed for that.
// ------------------------------------

export type BreadCollectionOperation<
  T extends string,
  P extends BreadOperationPaginationType,
  E = any
> = {
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

  error: E;
};

export type BreadOperation<T extends string, E = any> =
  | BreadStandardOperation<T, E>
  | BreadCollectionOperation<T, BreadOperationPaginationType, E>;

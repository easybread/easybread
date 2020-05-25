import { BreadSchema } from '@easybread/schemas';

import { BreadException, ServiceException } from '../exception';
import { BreadOperation } from './bread-operation';
import {
  BreadCollectionOperationOutputPagination,
  BreadCollectionOperationOutputWithPayload,
  BreadCollectionOperationOutputWithRawDataAndPayload,
  BreadFailedOperationRawPayload,
  BreadOperationOutput,
  BreadOperationOutputWithPayload,
  BreadOperationOutputWithRawData,
  BreadOperationOutputWithRawDataAndPayload
} from './bread-operation-output';

export function createSuccessfulOutput<TName extends string>(
  name: TName
): Omit<BreadOperationOutput<TName>, 'provider'> {
  return {
    name,
    rawPayload: { success: true }
  };
}

export function createSuccessfulOutputWithRawDataAndPayload<
  TName extends string,
  TRawData extends object,
  TPayload extends BreadSchema
>(
  name: TName,
  data: TRawData,
  payload: TPayload
): Omit<
  BreadOperationOutputWithRawDataAndPayload<TName, TRawData, TPayload>,
  'provider'
> {
  return {
    name,
    payload,
    rawPayload: { success: true, data }
  };
}

export function createSuccessfulCollectionOutputWithRawDataAndPayload<
  TName extends string,
  TRawData extends object,
  TPayload extends BreadSchema[]
>(
  name: TName,
  data: TRawData,
  payload: TPayload,
  pagination: BreadCollectionOperationOutputPagination | null = null
): Omit<
  BreadCollectionOperationOutputWithRawDataAndPayload<
    TName,
    TRawData,
    TPayload
  >,
  'provider'
> {
  return {
    name,
    payload,
    rawPayload: { success: true, data },
    pagination
  };
}

export function createSuccessfulOutputWithRawData<
  TName extends string,
  TRawData extends object
>(
  name: TName,
  data: TRawData
): Omit<BreadOperationOutputWithRawData<TName, TRawData>, 'provider'> {
  return {
    name,
    rawPayload: { success: true, data }
  };
}

export function createSuccessfulOutputWithPayload<
  TName extends string,
  TPayload extends BreadSchema
>(
  name: TName,
  payload: TPayload
): Omit<BreadOperationOutputWithPayload<TName, TPayload>, 'provider'> {
  return {
    name,
    payload,
    rawPayload: { success: true }
  };
}

export function createSuccessfulCollectionOutputWithPayload<
  TName extends string,
  TPayload extends BreadSchema[]
>(
  name: TName,
  payload: TPayload,
  pagination: BreadCollectionOperationOutputPagination
): Omit<
  BreadCollectionOperationOutputWithPayload<TName, TPayload>,
  'provider'
> {
  return {
    name,
    payload,
    rawPayload: { success: true },
    pagination
  };
}

export function createFailedOutput<
  TName extends string,
  TError extends ServiceException | BreadException | Error | object
>(
  name: TName,
  error: TError
): {
  name: TName;
  provider: string;
  rawPayload: BreadFailedOperationRawPayload;
} {
  return {
    name,
    provider: error['provider'] || 'unknown',
    rawPayload: { success: false, error }
  };
}

export function createFailedOperationOutput<T extends BreadOperation<string>>(
  name: T['name'],
  provider: string,
  error: ServiceException
): T['output'] {
  const rawPayload: BreadFailedOperationRawPayload = { success: false, error };

  return {
    name,
    provider,
    rawPayload
  };
}

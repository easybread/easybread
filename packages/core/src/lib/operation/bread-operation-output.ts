import { BreadSchema } from '@easybread/schemas';

import {
  BreadOperationOutputPagination,
  BreadOperationPaginationType,
} from './bread-operation-pagination';

/*
 * Basically we want these interfaces to be as strict as possible.
 * So we don't use optional fields or anything like that.
 * */

export interface BreadFailedOperationRawPayload {
  success: false;
  error: Error | string | object;
}

export interface BreadSuccessOperationRawPayload {
  success: true;
}

export interface BreadSuccessOperationRawPayloadWithData<TData> {
  success: true;
  data: TData;
}

//  ------------------------------------

export type BreadOperationOutputRawPayload =
  | BreadFailedOperationRawPayload
  | BreadSuccessOperationRawPayload;

export type BreadOperationOutputRawPayloadWithData<TData> =
  | BreadFailedOperationRawPayload
  | BreadSuccessOperationRawPayloadWithData<TData>;

//  ------------------------------------

interface BreadOperationOutputBase<TName extends string> {
  provider: string;
  name: TName;
}

export interface BreadOperationOutput<TName extends string>
  extends BreadOperationOutputBase<TName> {
  rawPayload: BreadOperationOutputRawPayload;
}

export interface BreadOperationOutputWithRawData<
  TName extends string,
  TRawData extends object
> extends BreadOperationOutputBase<TName> {
  rawPayload: BreadOperationOutputRawPayloadWithData<TRawData>;
}

export interface BreadOperationOutputWithPayload<
  TName extends string,
  TPayload extends BreadSchema
> extends BreadOperationOutputBase<TName> {
  rawPayload: BreadOperationOutputRawPayload;
  payload: TPayload;
}

export type BreadOperationOutputWithRawDataAndPayload<
  TName extends string,
  TRawData extends object,
  TPayload extends BreadSchema
> = BreadOperationOutputWithRawData<TName, TRawData> &
  BreadOperationOutputWithPayload<TName, TPayload>;

// COLLECTION OPERATION RELATED STUFF
// ------------------------------------

export interface BreadCollectionOperationOutputWithPayload<
  TName extends string,
  TPayload extends BreadSchema[],
  TPaginationType extends BreadOperationPaginationType = 'DISABLED'
> extends BreadOperationOutputBase<TName> {
  rawPayload: BreadOperationOutputRawPayload;
  payload: TPayload;
  pagination: BreadOperationOutputPagination<TPaginationType>;
}

export type BreadCollectionOperationOutputWithRawDataAndPayload<
  TName extends string,
  TRawData extends object,
  TPayload extends BreadSchema[],
  TPaginationType extends BreadOperationPaginationType = 'DISABLED'
> = BreadOperationOutputWithRawData<TName, TRawData> &
  BreadCollectionOperationOutputWithPayload<TName, TPayload, TPaginationType>;

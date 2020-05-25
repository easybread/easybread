import { BreadSchema } from '@easybread/schemas';

import {
  BreadOperationInputPagination,
  BreadOperationPaginationType
} from './bread-operation-pagination';

export interface BreadOperationInput<TName extends string> {
  name: TName;
  breadId: string;
}

// TODO: Thing may be a string. That is not good. Think about the better way
export interface BreadOperationInputWithParams<
  TName extends string,
  TParams extends object
> extends BreadOperationInput<TName> {
  params: TParams;
}

export interface BreadOperationInputWithPayload<
  TName extends string,
  TPayload extends object | BreadSchema | BreadSchema[]
> extends BreadOperationInput<TName> {
  payload: TPayload;
}

export type BreadOperationInputWithParamsAndPayload<
  TName extends string,
  TParams extends object,
  TPayload extends object | BreadSchema | BreadSchema[]
> = BreadOperationInputWithParams<TName, TParams> &
  BreadOperationInputWithPayload<TName, TPayload>;

// COLLECTION OPERATION RELATED STUFF
// ------------------------------------

export interface BreadCollectionOperationInput<
  TName extends string,
  TPaginationType extends BreadOperationPaginationType = 'DISABLED'
> {
  name: TName;
  breadId: string;
  pagination: BreadOperationInputPagination<TPaginationType>;
}

export interface BreadCollectionOperationInputWithParams<
  TName extends string,
  TParams extends object,
  TPaginationType extends BreadOperationPaginationType = 'DISABLED'
> extends BreadCollectionOperationInput<TName, TPaginationType> {
  params: TParams;
}

export interface BreadCollectionOperationInputWithPayload<
  TName extends string,
  TPayload extends object | BreadSchema | BreadSchema[],
  TPaginationType extends BreadOperationPaginationType = 'DISABLED'
> extends BreadCollectionOperationInput<TName, TPaginationType> {
  payload: TPayload;
}

export type BreadCollectionOperationInputWithParamsAndPayload<
  TName extends string,
  TParams extends object,
  TPayload extends object | BreadSchema | BreadSchema[],
  TPaginationType extends BreadOperationPaginationType = 'DISABLED'
> = BreadCollectionOperationInputWithParams<TName, TParams, TPaginationType> &
  BreadCollectionOperationInputWithPayload<TName, TPayload, TPaginationType>;

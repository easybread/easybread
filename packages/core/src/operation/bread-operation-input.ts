import { BreadSchema } from '@easybread/schemas';

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

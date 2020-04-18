import { Thing } from 'schema-dts';

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
  TPayload extends object | object[] | Thing[] | Thing
> extends BreadOperationInput<TName> {
  payload: TPayload;
}

export type BreadOperationInputWithParamsAndPayload<
  TName extends string,
  TParams extends object,
  TPayload extends object | object[] | Thing[] | Thing
> = BreadOperationInputWithParams<TName, TParams> &
  BreadOperationInputWithPayload<TName, TPayload>;

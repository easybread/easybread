import { Thing } from 'schema-dts';

// TODO: Thing may be a string. That is not good. Think about the better way
export interface BreadOperationInput<TName extends string> {
  name: TName;
  breadId: string;
}

export interface BreadOperationInputWithParams<
  TName extends string,
  TParams extends object | Thing
> extends BreadOperationInput<TName> {
  params: TParams;
}

export interface BreadOperationInputWithPayload<
  TName extends string,
  TPayload extends object | object[] | Thing[] | Thing
> extends BreadOperationInput<TName> {
  payload: TPayload;
}

// TODO: is there a better way of doing it?
export type BreadOperationInputWithParamsAndPayload<
  TName extends string,
  TParams extends object | Thing,
  TPayload extends object | object[] | Thing[] | Thing
> = BreadOperationInputWithParams<TName, TParams> &
  BreadOperationInputWithPayload<TName, TPayload>;

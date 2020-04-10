import { Thing } from 'schema-dts';

/*
 * Basically we want these interfaces to be as strict as possible.
 * So we don't use optional fields or anything like that.
 * */

interface BreadFailedOperationRawPayload {
  success: false;
  error: Error | string | object;
}

interface BreadSuccessOperationRawPayload {
  success: true;
}

interface BreadSuccessOperationRawPayloadWithData<TData> {
  success: true;
  data: TData;
}

//  ------------------------------------

type BreadOperationOutputRawPayload =
  | BreadFailedOperationRawPayload
  | BreadSuccessOperationRawPayload;

type BreadOperationOutputRawPayloadWithData<TData> =
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
  TPayload extends Thing | Thing[]
> extends BreadOperationOutputBase<TName> {
  rawPayload: BreadOperationOutputRawPayload;
  payload: TPayload;
}

//  ------------------------------------

// TODO: is there a better way of doing it?
export type BreadOperationOutputWithRawDataAndPayload<
  TName extends string,
  TRawData extends object,
  TPayload extends Thing | Thing[]
> = BreadOperationOutputWithRawData<TName, TRawData> &
  BreadOperationOutputWithPayload<TName, TPayload>;
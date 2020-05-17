import { BreadSchema } from '@easybread/schemas';

/*
 * Basically we want these interfaces to be as strict as possible.
 * So we don't use optional fields or anything like that.
 * */

export interface BreadFailedOperationRawPayload {
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
  TPayload extends BreadSchema | BreadSchema[]
> extends BreadOperationOutputBase<TName> {
  rawPayload: BreadOperationOutputRawPayload;
  payload: TPayload;
}

//  ------------------------------------

export type BreadOperationOutputWithRawDataAndPayload<
  TName extends string,
  TRawData extends object,
  TPayload extends BreadSchema | BreadSchema[]
> = BreadOperationOutputWithRawData<TName, TRawData> &
  BreadOperationOutputWithPayload<TName, TPayload>;

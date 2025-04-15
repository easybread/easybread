import type { AnySchema } from '@easybread/schemas';

import type {
  CommandBase,
  CommandBaseInput,
  CommandBaseOutputFailed,
  CommandBaseOutputSuccessful,
} from './command-base';

export type CommandStandardInput<
  TParams extends AnySchema | null,
  TPayload extends AnySchema | AnySchema[] | null,
> = CommandBaseInput & {
  params: TParams;
  payload: TPayload;
};

export type CommandStandardOutputSuccessful<
  TPayload extends AnySchema | AnySchema[] | null,
  TRawPayload extends object | null,
> = CommandBaseOutputSuccessful & {
  payload: TPayload;
  rawPayload: TRawPayload;
};

export type CommandStandardOutputFailed = CommandBaseOutputFailed;
export type CommandStandard<
  TName extends string,
  TInputParams extends AnySchema | null,
  TInputPayload extends AnySchema | AnySchema[] | null,
  TOutputPayload extends AnySchema | AnySchema[] | null,
  TOutputRawPayload extends object | null,
  TError = unknown,
> = CommandBase<
  'STANDARD',
  TName,
  CommandStandardInput<TInputParams, TInputPayload>,
  | CommandStandardOutputSuccessful<TOutputPayload, TOutputRawPayload>
  | CommandStandardOutputFailed,
  TError
>;

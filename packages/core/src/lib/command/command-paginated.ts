import type { AnySchema } from '@easybread/schemas';

import type {
  PaginationInput,
  PaginationOutput,
  PaginationType,
} from '../pagination';

import type {
  CommandBase,
  CommandBaseInput,
  CommandBaseOutputFailed,
  CommandBaseOutputSuccessful,
} from './command-base';

export type CommandPaginatedInput<
  TPaginationType extends PaginationType,
  TParams extends AnySchema | null,
> = CommandBaseInput & {
  pagination: PaginationInput<TPaginationType>;
  params: TParams;
};

export type CommandPaginatedOutputSuccessful<
  TPaginationType extends PaginationType,
  TOutputPayload extends AnySchema[],
  TOutputRawPayload extends object[] | object | null,
> = CommandBaseOutputSuccessful & {
  pagination: PaginationOutput<TPaginationType>;
  payload: TOutputPayload;
  rawPayload: TOutputRawPayload;
};

export type CommandPaginatedOutputFailed<
  TPaginationType extends PaginationType,
> = CommandBaseOutputFailed & {
  pagination: PaginationOutput<TPaginationType>;
};

export type CommandPaginated<
  TPaginationType extends PaginationType,
  TName extends string,
  TInputParams extends AnySchema | null,
  TOutputPayload extends AnySchema[],
  TOutputRawPayload extends object[] | object | null,
  TError = unknown,
> = CommandBase<
  'PAGINATED',
  TName,
  CommandPaginatedInput<TPaginationType, TInputParams>,
  | CommandPaginatedOutputSuccessful<
      TPaginationType,
      TOutputPayload,
      TOutputRawPayload
    >
  | CommandPaginatedOutputFailed<TPaginationType>,
  TError
>;

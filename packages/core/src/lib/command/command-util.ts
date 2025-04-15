import type { Simplify } from '@easybread/common';
import type { AnySchema } from '@easybread/schemas';

import { PAGINATION_TYPE, type PaginationType } from '../pagination';

import type { CommandBaseOutputSuccessful } from './command-base';
import { type CommandPaginated } from './command-paginated';
import type { CommandStandard } from './command-standard';

export type CommandStandardAny = CommandStandard<
  any,
  AnySchema | null,
  AnySchema | AnySchema[] | null,
  AnySchema | AnySchema[] | null,
  object | null,
  any
>;

export type CommandPaginatedAny = CommandPaginated<
  PaginationType,
  any,
  AnySchema | null,
  AnySchema[],
  object[] | object,
  any
>;

export type CommandAny = CommandStandardAny | CommandPaginatedAny;

/**
 * Basically an object with a name property
 */
export type CommandLikeNamed<TName extends string> = { name: TName };

type _CommandPaginatedAnyOfSpecificPaginationType<
  TPaginationType extends PaginationType,
> = CommandPaginated<
  TPaginationType,
  any,
  AnySchema | null,
  AnySchema[],
  object[],
  any
>;

export type CommandPaginatedDisabledAny =
  _CommandPaginatedAnyOfSpecificPaginationType<typeof PAGINATION_TYPE.DISABLED>;

export type CommandPaginatedCursorAny =
  _CommandPaginatedAnyOfSpecificPaginationType<typeof PAGINATION_TYPE.CURSOR>;

export type CommandPaginatedPageAny =
  _CommandPaginatedAnyOfSpecificPaginationType<typeof PAGINATION_TYPE.PAGE>;

export type CommandPaginatedOffsetAny =
  _CommandPaginatedAnyOfSpecificPaginationType<typeof PAGINATION_TYPE.OFFSET>;

export type inferCommandIO<T extends CommandAny> = T['$io'];

export type inferCommandInput<T extends CommandAny> = Simplify<
  inferCommandIO<T>['input']
>;

export type inferCommandOutput<T extends CommandAny> =
  inferCommandIO<T>['output'];

export type inferCommandOutputSuccessful<T extends CommandAny> = Extract<
  inferCommandOutput<T>,
  CommandBaseOutputSuccessful
>;

export type inferCommandError<T extends CommandAny> =
  inferCommandIO<T>['error'];

export type inferCommandName<T extends CommandAny> = T['name'];

import type { AuthStrategyAny } from '../auth-strategy';
import type {
  CommandLikeNamed,
  inferCommandInput,
  inferCommandName,
  inferCommandOutput,
} from '../command';
import type {
  CommandHandlerMapAny,
  inferCommandHandlerCommand,
  inferCommandHandlerMapCommandPaginated,
} from '../command-handler';

import { ServiceAdapter } from './service-adapter';

export type ServiceAdapterAny = ServiceAdapter<
  CommandHandlerMapAny,
  AuthStrategyAny,
  any
>;

export type inferServiceAdapterAuth<T extends ServiceAdapterAny> = T['auth'];

export type inferServiceAdapterCommandName<T extends ServiceAdapterAny> =
  keyof T['handlerMap'] & string;

export type inferServiceAdapterCommand<T extends ServiceAdapterAny> =
  inferCommandHandlerCommand<T['handlerMap'][keyof T['handlerMap']]>;

export type inferServiceAdapterCommandByName<
  TAdapter extends ServiceAdapterAny,
  TName extends inferServiceAdapterCommandName<TAdapter>,
> = inferCommandHandlerCommand<TAdapter['handlerMap'][TName]>;

export type inferServiceAdapterCommandInputByName<
  TAdapter extends ServiceAdapterAny,
  TName extends inferServiceAdapterCommandName<TAdapter>,
> = inferCommandInput<inferServiceAdapterCommandByName<TAdapter, TName>>;

export type inferServiceAdapterCommandOutputByName<
  TAdapter extends ServiceAdapterAny,
  TName extends inferServiceAdapterCommandName<TAdapter>,
> = inferCommandOutput<inferServiceAdapterCommandByName<TAdapter, TName>>;

// -----------------------------------------------------------------------------
// Pagination Specific utils

export type inferServiceAdapterCommandPaginated<T extends ServiceAdapterAny> =
  inferCommandHandlerMapCommandPaginated<T['handlerMap']>;

export type inferServiceAdapterCommandPaginatedName<
  T extends ServiceAdapterAny,
> = inferCommandName<inferServiceAdapterCommandPaginated<T>>;

export type inferServiceAdapterCommandPaginatedByName<
  T extends ServiceAdapterAny,
  TName extends inferServiceAdapterCommandPaginatedName<T>,
> = Extract<inferServiceAdapterCommandPaginated<T>, CommandLikeNamed<TName>>;

export type inferServiceAdapterCommandPaginatedInputByName<
  T extends ServiceAdapterAny,
  TName extends inferServiceAdapterCommandPaginatedName<T>,
> = inferCommandInput<inferServiceAdapterCommandPaginatedByName<T, TName>>;

export type inferServiceAdapterCommandPaginatedOutputByName<
  T extends ServiceAdapterAny,
  TName extends inferServiceAdapterCommandPaginatedName<T>,
> = inferCommandOutput<inferServiceAdapterCommandPaginatedByName<T, TName>>;

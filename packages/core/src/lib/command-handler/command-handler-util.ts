import type { AuthStrategyAny } from '../auth-strategy';
import type { CommandAny, CommandPaginatedAny } from '../command';

import type { CommandHandler } from './command-handler';

export type CommandHandlerAny = CommandHandler<
  CommandAny,
  AuthStrategyAny,
  any
>;

export type CommandHandlerMap<T extends string> = {
  readonly [key in T]: CommandHandlerAny & { readonly name: key };
};
export type CommandHandlerMapAny = CommandHandlerMap<string>;

export type inferCommandHandlerMapHandler<T extends CommandHandlerMapAny> =
  T[keyof T];

export type inferCommandHandlerCommand<T extends CommandHandlerAny> =
  T extends CommandHandler<infer TCommand, any, any> ? TCommand : never;

export type inferCommandHandlerMapCommandPaginated<
  T extends CommandHandlerMapAny,
> = Extract<inferCommandHandlerCommand<T[keyof T]>, CommandPaginatedAny>;

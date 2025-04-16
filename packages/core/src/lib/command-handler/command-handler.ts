import { type AuthStrategyAny } from '../auth-strategy';
import type {
  CommandAny,
  CommandError,
  inferCommandInput,
  inferCommandName,
  inferCommandOutputSuccessful,
} from '../command';
import { CommandContext } from '../command-context';
import type { ServiceAdapterOptions } from '../common-interfaces';

export type CommandHandler<
  TCmd extends CommandAny,
  TAuth extends AuthStrategyAny,
  TOptions extends ServiceAdapterOptions | null = null,
> = {
  name: inferCommandName<TCmd>;

  handle(
    input: inferCommandInput<TCmd>,
    context: CommandContext<TAuth>,
    options: TOptions,
  ): Promise<inferCommandOutputSuccessful<TCmd>>;

  retryBackoffFactor?: number;

  shouldRetry?: (error: CommandError<TCmd>, retriesCount: number) => boolean;
};

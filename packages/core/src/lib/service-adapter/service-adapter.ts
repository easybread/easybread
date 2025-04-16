import { AuthStrategy } from '../auth-strategy';
import type { inferCommandInput, inferCommandOutput } from '../command';
import { CommandContext } from '../command-context';
import { CommandExecutor } from '../command-executor';
import type {
  CommandHandlerMap,
  inferCommandHandlerCommand,
} from '../command-handler';
import { commandOutputFailed } from '../command-output-factory/command-output-failed';
import { ServiceAdapterOptions } from '../common-interfaces';
import { NotImplementedException, ServiceException } from '../exception';

/**
 * Service adapter provides the logic for accessing the 3rd party service api
 *
 * @template THandlerMap defines all operations this adapter can handle
 * @template TAuth defines the AuthStrategy used by the service
 * @template TOptions defines the type of options that will be passed to every handler
 */
export abstract class ServiceAdapter<
  THandlerMap extends CommandHandlerMap<string>,
  TAuth extends AuthStrategy<object>,
  TOptions extends ServiceAdapterOptions | null = null,
> {
  readonly handlerMap: THandlerMap;
  readonly auth: TAuth;
  readonly options: TOptions;

  abstract readonly provider: string;

  constructor(handlerMap: THandlerMap, auth: TAuth, options: TOptions) {
    this.handlerMap = handlerMap;
    this.auth = auth;
    this.options = options;
  }

  async processCommand<TName extends keyof THandlerMap>(
    name: TName,
    input: inferCommandInput<inferCommandHandlerCommand<THandlerMap[TName]>>,
    context: CommandContext<TAuth>,
  ): Promise<
    inferCommandOutput<inferCommandHandlerCommand<THandlerMap[TName]>>
  > {
    try {
      const handler = this.findHandler(name);
      const options = this.options;
      const executor = new CommandExecutor({
        handler,
        input,
        options,
        context,
      });

      return await executor.execute();
    } catch (error) {
      return commandOutputFailed(input.breadId, this.transformError(error));
    }
  }

  protected findHandler<TName extends keyof THandlerMap>(
    operationName: TName,
  ): THandlerMap[TName] {
    const handler = this.handlerMap[operationName];

    if (!handler) throw new NotImplementedException(operationName as string);

    return handler;
  }

  protected transformError(error: unknown) {
    return ServiceException.fromUnknown(this.provider, error);
  }
}

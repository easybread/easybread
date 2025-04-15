import type {
  CommandAny,
  inferCommandInput,
  inferCommandOutput,
} from '../command';
import { CommandContext } from '../command-context';
import type {
  CommandHandlerAny,
  inferCommandHandlerCommand,
} from '../command-handler';
import { ServiceAdapterOptions } from '../common-interfaces';
import { RetriesLimitReachedException } from '../exception';
import { HttpTransport } from '../transport/http';

interface CommandExecutorProps<THandler extends CommandHandlerAny> {
  handler: THandler;
  input: inferCommandInput<inferCommandHandlerCommand<THandler>>;
  options: ServiceAdapterOptions | null;
  context: CommandContext<any>;
}

// TODO:
//  - factor out the retry logic into a separate
//    abstract class "RetryPolicy" or "RetryStrategy".
//    Create a suitable subclass depending on the handler properties using a factory.

/**
 * Executes the command handler.
 * Encapsulates the logic of executing a single command with retries.
 *
 * @template THandler command handler type
 */
export class CommandExecutor<
  THandler extends CommandHandlerAny,
  TCommand extends CommandAny = inferCommandHandlerCommand<THandler>,
> {
  static DEFAULT_RETRIES_LIMIT = 10;

  private readonly handler: THandler;
  private readonly input: CommandExecutorProps<THandler>['input'];
  private readonly options: CommandExecutorProps<THandler>['options'];
  private readonly context: CommandExecutorProps<THandler>['context'];
  private readonly retriesLimit: number;
  private readonly retryBackoffFactor: number;

  private delay = 0;
  private retriesCount = 0;
  private startTime = 0;

  constructor(
    { handler, input, options, context }: CommandExecutorProps<THandler>,
    retriesLimit = CommandExecutor.DEFAULT_RETRIES_LIMIT,
  ) {
    this.handler = handler;
    this.input = input;
    this.options = options;
    this.context = context;
    this.retriesLimit = retriesLimit;
    this.retryBackoffFactor = handler.retryBackoffFactor ?? 2;
  }

  async execute(): Promise<inferCommandOutput<TCommand>> {
    this.startTime = Date.now();
    return this.iteration();
  }

  private async iteration(): Promise<inferCommandOutput<TCommand>> {
    return await this.handler
      .handle(this.input, this.context, this.options)
      .catch(error => {
        if (this.shouldRetry(error)) return this.retry(error);
        throw error;
      });
  }

  private shouldRetry(error: unknown): boolean {
    if (!HttpTransport.isHttpError(error)) return false;

    const handlerDecision = this.handler.shouldRetry
      ? this.handler.shouldRetry(error, this.retriesCount)
      : null;

    if (handlerDecision === null) return this.isKnownRetryEligibleError(error);

    return handlerDecision;
  }

  private async retry(error: unknown) {
    if (this.retriesCount >= this.retriesLimit) {
      throw new RetriesLimitReachedException({
        endTime: Date.now(),
        input: this.input,
        operationName: this.handler.name,
        options: this.options,
        retriesCount: this.retriesCount,
        startTime: this.startTime,
        cause: error,
      });
    }

    await this.wait();

    this.increaseDelay();
    this.increaseRetriesCount();

    return await this.iteration();
  }

  private async wait() {
    await new Promise(r => setTimeout(r, this.delay));
  }

  private increaseDelay() {
    this.delay = this.delay ? this.delay * this.retryBackoffFactor : 1000;
  }

  private increaseRetriesCount() {
    this.retriesCount++;
  }

  private isKnownRetryEligibleError(error: unknown): boolean {
    // TODO: handle different errors differently.

    return (
      HttpTransport.isTooManyRequestsError(error) ||
      HttpTransport.isGatewayTimeoutError(error) ||
      HttpTransport.isUnavailableError(error) ||
      // TODO: Maybe include conflict errors, but handle them better.
      //  Sometimes it might mean a race condition,
      //  sometimes it means a conflicting data
      //  eg, when creating an entity that already exists
      // BreadHttpTransport.isConflictError(error) ||

      // TODO: should we handle internal server errors differently?
      HttpTransport.isInternalServerError(error)
    );
  }
}

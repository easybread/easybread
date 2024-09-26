import {
  BreadOperationContext,
  type BreadOperationHandler,
  type InferOperationHandlerOperation,
} from '../operation';
import { BreadServiceAdapterOptions } from '../common-interfaces';
import { RetriesLimitReachedException } from '../exception';
import { BreadHttpTransport } from '../transport/http';

interface OperationExecutorProps<
  THandler extends BreadOperationHandler<any, any, any>
> {
  handler: THandler;
  input: InferOperationHandlerOperation<THandler>['input'];
  options: BreadServiceAdapterOptions | null;
  context: BreadOperationContext<any, any, any>;
}

// TODO:
//  - factor out the retry logic into a separate
//    abstract class "RetryPolicy" or "RetryStrategy".
//    Create a suitable subclass depending on the handler properties using a factory.

/**
 * Executes the operation handler.
 * Encapsulates the logic of executing a single operation with retries.
 *
 * @template THandler operation handler type
 */
export class OperationExecutor<
  THandler extends BreadOperationHandler<any, any, any>
> {
  static DEFAULT_RETRIES_LIMIT = 10;

  private readonly handler: THandler;
  private readonly input: OperationExecutorProps<THandler>['input'];
  private readonly options: OperationExecutorProps<THandler>['options'];
  private readonly context: OperationExecutorProps<THandler>['context'];
  private readonly retriesLimit: number;
  private readonly retryBackoffFactor: number;

  private delay = 0;
  private retriesCount = 0;
  private startTime = 0;

  constructor(
    { handler, input, options, context }: OperationExecutorProps<THandler>,
    retriesLimit = OperationExecutor.DEFAULT_RETRIES_LIMIT
  ) {
    this.handler = handler;
    this.input = input;
    this.options = options;
    this.context = context;
    this.retriesLimit = retriesLimit;
    this.retryBackoffFactor = handler.retryBackoffFactor ?? 2;
  }

  async execute(): Promise<InferOperationHandlerOperation<THandler>['output']> {
    this.startTime = Date.now();
    return this.iteration();
  }

  private async iteration(): Promise<
    InferOperationHandlerOperation<THandler>['output']
  > {
    return await this.handler
      .handle(this.input, this.context, this.options)
      .catch((error) => {
        if (this.shouldRetry(error)) return this.retry(error);
        throw error;
      });
  }

  private shouldRetry(error: unknown): boolean {
    if (this.isKnownRetryEligibleError(error)) {
      return true;
    }

    return this.handler.shouldRetry
      ? this.handler.shouldRetry(error, this.retriesCount)
      : false;
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
    await new Promise((r) => setTimeout(r, this.delay));
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
      BreadHttpTransport.isTooManyRequestsError(error) ||
      BreadHttpTransport.isGatewayTimeoutError(error) ||
      BreadHttpTransport.isUnavailableError(error) ||
      BreadHttpTransport.isConflictError(error) ||
      BreadHttpTransport.isInternalServerError(error)
    );
  }
}

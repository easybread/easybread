import { AxiosError, isAxiosError } from 'axios';

import { BreadAuthStrategy } from '../auth-strategy';
import { BreadServiceAdapterOptions } from '../common-interfaces';
import {
  BreadException,
  NotImplementedException,
  ServiceException,
} from '../exception';
import {
  type BreadOperation,
  type BreadOperationContext,
  type BreadOperationHandlerDistributed,
  createFailedOperationOutput,
} from '../operation';
import { OperationExecutor } from '../operation-executor';

/**
 * Service adapter provides the logic for accessing the 3rd party service api
 *
 * @template TOperation defines operation interfaces union type the adapter can handle
 * @template TAuthStrategy defines the AuthStrategy used by the service
 * @template TOptions defines the type of options that will be passed to every handler
 * @template THandler type alias for Operation Handler type that is this adapter can register
 */
export abstract class BreadServiceAdapter<
  TOperation extends BreadOperation<string>,
  TAuthStrategy extends BreadAuthStrategy<object>,
  TOptions extends BreadServiceAdapterOptions | null = null
> {
  protected options: TOptions;

  private handlers: Map<
    TOperation['name'],
    BreadOperationHandlerDistributed<TOperation, TAuthStrategy, TOptions>
  > = new Map();

  abstract provider: string;

  // TODO: remove " = null as TOptions"
  constructor(options: TOptions = null as TOptions) {
    this.options = options;
  }

  async processOperation<O extends TOperation>(
    input: O['input'],
    context: BreadOperationContext<TAuthStrategy>
  ): Promise<O['output']> {
    try {
      const handler = this.findHandler(input.name);
      const options = this.options;
      const executor = new OperationExecutor({
        handler,
        input,
        options,
        context,
      });

      return this.setProviderToOutput(await executor.execute());
    } catch (error) {
      return createFailedOperationOutput<O>(
        input.name,
        this.provider,
        this.createServiceException(error)
      );
    }
  }

  // TODO: improve this method
  protected createServiceException(
    error:
      | Error
      | AxiosError
      | BreadException
      | ServiceException
      | string
      | unknown
  ): ServiceException {
    if (error instanceof ServiceException) return error;

    if (typeof error === 'string') {
      return new ServiceException(this.provider, error);
    }

    if (error instanceof Error) {
      return new ServiceException(
        this.provider,
        this.createServiceExceptionMessageFromError(error),
        error
      );
    }

    return new ServiceException(this.provider, `${error}`);
  }

  private createServiceExceptionMessageFromError(error: Error) {
    return isAxiosError(error)
      ? this.createServiceExceptionMessageFromAxiosError(error)
      : error.message;
  }

  protected createServiceExceptionMessageFromAxiosError(
    error: AxiosError
  ): string {
    return error.message;
  }

  protected setProviderToOutput(
    outputWithoutProvider: Omit<TOperation['output'], 'provider'>
  ): TOperation['output'] {
    return {
      ...outputWithoutProvider,
      provider: this.provider,
    };
  }

  protected registerOperationHandlers(
    ...operationHandlers: BreadOperationHandlerDistributed<
      TOperation,
      TAuthStrategy,
      TOptions
    >[]
  ): void {
    operationHandlers.map((h) => this.registerOperationHandler(h.name, h));
  }

  protected registerOperationHandler<TName extends TOperation['name']>(
    operationName: TName,
    operationHandler: BreadOperationHandlerDistributed<
      TOperation,
      TAuthStrategy,
      TOptions
    >
  ): void {
    // TODO: do something if exists
    if (this.handlers.has(operationName)) return;

    this.handlers.set(operationName, operationHandler);
  }

  protected findHandler(
    operationName: TOperation['name']
  ): BreadOperationHandlerDistributed<TOperation, TAuthStrategy, TOptions> {
    const handler = this.handlers.get(operationName);
    if (!handler) {
      throw new NotImplementedException();
    }
    return handler;
  }
}

// ------------------------------------

export type BreadServiceAdapterAny = BreadServiceAdapter<any, any, any>;

export type InferServiceAdapterOperation<T extends BreadServiceAdapterAny> =
  T extends BreadServiceAdapter<infer TOperation, any, any>
    ? TOperation
    : never;

export type InferServiceAdapterAuthAdapter<T extends BreadServiceAdapterAny> =
  T extends BreadServiceAdapter<any, infer TAuth, any> ? TAuth : never;

export type InferServiceAdapterOptions<T extends BreadServiceAdapterAny> =
  T extends BreadServiceAdapter<any, any, infer TOptions> ? TOptions : never;

import { AxiosError } from 'axios';

import { BreadAuthStrategy } from '../auth-strategy';
import { BreadServiceAdapterOptions } from '../common-interfaces';
import {
  BreadException,
  NotImplementedException,
  ServiceException,
} from '../exception';
import {
  BreadOperation,
  BreadOperationContext,
  BreadOperationHandler,
  createFailedOperationOutput,
} from '../operation';

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
  TOptions extends BreadServiceAdapterOptions | null = null,
  THandler extends BreadOperationHandler<
    TOperation,
    TAuthStrategy,
    TOptions
  > = BreadOperationHandler<TOperation, TAuthStrategy, TOptions>
> {
  protected options: TOptions;

  private handlers: Map<TOperation['name'], THandler> = new Map();

  abstract provider: string;

  // TODO: remove " = null as TOptions"
  constructor(options: TOptions = null as TOptions) {
    this.options = options;
  }

  async processOperation<O extends TOperation>(
    input: O['input'],
    context: BreadOperationContext<TOperation, TAuthStrategy, TOptions>
  ): Promise<O['output']> {
    try {
      const handler = this.findHandler(input.name);
      const output = await handler.handle(input, context, this.options);
      return this.setProviderToOutput(output);
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
        this.isAxiosError(error)
          ? this.createServiceExceptionMessageFromAxiosError(error)
          : error.message,
        error
      );
    }

    return new ServiceException(this.provider, `${error}`);
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

  protected registerOperationHandlers(...operationHandlers: THandler[]): void {
    operationHandlers.map((h) => this.registerOperationHandler(h.name, h));
  }

  protected registerOperationHandler(
    operationName: TOperation['name'],
    operationHandler: THandler
  ): void {
    // TODO: do something if exists
    if (this.handlers.has(operationName)) return;

    this.handlers.set(operationName, operationHandler);
  }

  protected findHandler(operationName: TOperation['name']): THandler {
    const handler = this.handlers.get(operationName);
    if (!handler) {
      throw new NotImplementedException();
    }
    return handler;
  }

  private isAxiosError(err: Error | AxiosError): err is AxiosError {
    return 'isAxiosError' in err && err.isAxiosError;
  }
}

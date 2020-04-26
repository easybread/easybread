import { AxiosError } from 'axios';

import { BreadAuthStrategy } from '../auth-strategy';
import {
  BreadException,
  NotImplementedException,
  ServiceException
} from '../exception';
import {
  BreadOperation,
  BreadOperationContext,
  BreadOperationHandler
} from '../operation';

/**
 * Service adapter provides the logic for accessing the 3rd party service api
 *
 * @template T defines operation interfaces union type the adapter can handle
 * @template A defines the AuthStrategy used by the service
 */
export abstract class BreadServiceAdapter<
  T extends BreadOperation<string>,
  A extends BreadAuthStrategy<object>
> {
  private handlers: Map<T['name'], BreadOperationHandler<T, A>> = new Map();

  abstract provider: string;

  async processOperation<O extends T>(
    input: O['input'],
    context: BreadOperationContext<T, A>
  ): Promise<O['output']> {
    try {
      const handler = this.findHandler(input.name);
      const output = await handler.handle(input, context);
      return this.setProviderToOutput(output);
    } catch (error) {
      throw this.createServiceException(error);
    }
  }

  // TODO: improve this method
  protected createServiceException(
    error: Error | AxiosError | BreadException | ServiceException | string
  ): ServiceException {
    if (error instanceof ServiceException) return error;

    if (typeof error === 'string') {
      return new ServiceException(this.provider, error);
    }

    if (this.isAxiosError(error)) {
      return new ServiceException(
        this.provider,
        this.createServiceExceptionMessageFromAxiosError(error),
        error
      );
    }

    return new ServiceException(this.provider, error.message, error);
  }

  protected createServiceExceptionMessageFromAxiosError(
    error: AxiosError
  ): string {
    return error.message;
  }

  protected setProviderToOutput(
    outputWithoutProvider: Omit<T['output'], 'provider'>
  ): T['output'] {
    return {
      ...outputWithoutProvider,
      provider: this.provider
    };
  }

  protected registerOperationHandlers(
    ...operationHandlers: BreadOperationHandler<T, A>[]
  ): void {
    operationHandlers.map(h => this.registerOperationHandler(h.name, h));
  }

  protected registerOperationHandler(
    operationName: T['name'],
    operationHandler: BreadOperationHandler<T, A>
  ): void {
    // TODO: do something if exists
    if (this.handlers.has(operationName)) return;

    this.handlers.set(operationName, operationHandler);
  }

  protected findHandler(operationName: T['name']): BreadOperationHandler<T, A> {
    if (!this.handlers.has(operationName)) {
      throw new NotImplementedException();
    }
    return this.handlers.get(operationName) as BreadOperationHandler<T, A>;
  }

  private isAxiosError(arg: Error | AxiosError): arg is AxiosError {
    return !!arg['isAxiosError'];
  }
}

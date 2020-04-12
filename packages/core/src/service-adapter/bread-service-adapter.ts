import { BreadAuthStrategy } from '../auth-strategy';
import { NotImplementedException, ServiceException } from '../exception';
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
      return this.setProviderToOutput(await handler.handle(input, context));
    } catch (error) {
      // TODO: throw different type of exception
      //       (when exceptions design is finished)
      throw new ServiceException(this.provider, error);
    }
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
    operationHandlers.map((h) => this.registerOperationHandler(h.name, h));
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
}

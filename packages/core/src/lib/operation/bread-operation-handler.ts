import { BreadAuthStrategy } from '../auth-strategy';
import { BreadServiceAdapterOptions } from '../common-interfaces';
import { BreadOperation } from './bread-operation';
import { BreadOperationContext } from './bread-operation-context';

export interface BreadOperationHandler<
  TOperation extends BreadOperation<string>,
  TAuthStrategy extends BreadAuthStrategy<object>,
  TOptions extends BreadServiceAdapterOptions | null = null
> {
  name: TOperation['name'];

  handle(
    input: TOperation['input'],
    context: BreadOperationContext<TOperation, TAuthStrategy, TOptions>,
    options: TOptions
  ): Promise<Omit<TOperation['output'], 'provider'>>;

  /**
   * A function that determines whether the operation should be retried.
   * If not provided, only the standard "Too many requests" errors
   * will lead to retries.
   *
   * @param error
   * @param retriesCount
   */
  shouldRetry?: (error: unknown, retriesCount: number) => boolean;

  /**
   * The factor by which the delay between retries will be multiplied.
   */
  retryBackoffFactor?: number;
}

export type InferOperationHandlerOperation<T extends object> =
  T extends BreadOperationHandler<infer O, any, any> ? O : never;

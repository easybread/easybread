import { BreadOperation } from './bread-operation';
import { BreadOperationContext } from './bread-operation-context';
import { BreadAuthStrategy } from '../auth-strategy';
import type { BreadServiceAdapterOptions } from '../common-interfaces';
import type { BreadHttpTransportError } from '../transport/http';

export interface BreadOperationHandler<
  TOperation extends BreadOperation<string>,
  TAuthStrategy extends BreadAuthStrategy<object>,
  TOptions extends BreadServiceAdapterOptions | null = null
> {
  name: TOperation['name'];

  handle(
    input: TOperation['input'],
    context: BreadOperationContext<TAuthStrategy>,
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
  shouldRetry?: (
    error: BreadOperationError<TOperation>,
    retriesCount: number
  ) => boolean;

  /**
   * The factor by which the delay between retries will be multiplied.
   */
  retryBackoffFactor?: number;
}

export type InferOperationHandlerOperation<T extends object> =
  T extends BreadOperationHandler<infer O, any, any> ? O : never;

export type BreadOperationError<TOperation extends BreadOperation<string>> =
  BreadHttpTransportError<TOperation['error']>;

/**
 * distribute the handler type
 * to all given operation types (assuming the TOperation type is a union)
 */
export type BreadOperationHandlerDistributed<
  TOperation extends BreadOperation<any, any>,
  TAuthStrategy extends BreadAuthStrategy<object>,
  TOptions extends BreadServiceAdapterOptions | null = null
> = TOperation extends BreadOperation<any, any>
  ? BreadOperationHandler<TOperation, TAuthStrategy, TOptions>
  : never;

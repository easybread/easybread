import { BreadAuthStrategy } from '../auth-strategy';
import {
  BreadCollectionOperation,
  BreadCollectionOperationInputPagination,
  BreadOperation,
  BreadOperationContext
} from '../operation';
import { BreadServiceAdapter } from '../service-adapter';
import { BreadStateAdapter } from '../state';

/**
 * Main library class.
 *
 * @template TOperation Defines Operations the client can handle.
 * @template A Defines Auth Strategy the client is going to use.
 */
export class EasyBreadClient<
  TOperation extends BreadOperation<string>,
  TAuth extends BreadAuthStrategy<object>
> {
  /**
   * @param stateAdapter state adapter to use for persistence (save tokens & etc)
   * @param serviceAdapter a "plugin" service adapter.
   *                       Provides logic for requesting and transforming data
   * @param authStrategy an Auth strategy to use
   */
  constructor(
    private readonly stateAdapter: BreadStateAdapter,
    private readonly serviceAdapter: BreadServiceAdapter<TOperation, TAuth>,
    private readonly authStrategy: TAuth
  ) {}

  async invoke<O extends TOperation>(input: O['input']): Promise<O['output']> {
    const context = this.createContext(input.breadId);

    return this.preProcess(input, context)
      .then(input => this.process(input, context))
      .then(output => this.postProcess(output, context));
  }

  async *allPages<
    O extends Extract<TOperation, BreadCollectionOperation<string>>
  >(
    input: Omit<O['input'], 'pagination'>,
    pageSize = 50
  ): AsyncGenerator<TOperation['output'], void, unknown> {
    let page = 0;

    while (true) {
      const pagination: BreadCollectionOperationInputPagination = {
        skip: page++ * pageSize,
        count: pageSize
      };

      const result = await this.invoke<O>({ ...input, pagination });

      yield result;

      // pagination is not supported
      if (result.pagination === null) return;

      const { count, skip, totalCount } = result.pagination;

      // reached the end of the collection
      if (skip + count >= totalCount) return;
    }
  }

  private createContext(
    breadId: string
  ): BreadOperationContext<TOperation, TAuth> {
    return new BreadOperationContext({
      state: this.stateAdapter,
      auth: this.authStrategy,
      client: this,
      breadId
    });
  }

  private async process<O extends TOperation>(
    input: O['input'],
    context: BreadOperationContext<TOperation, TAuth>
  ): Promise<O['output']> {
    return await this.serviceAdapter.processOperation(input, context);
  }

  private async preProcess<I extends TOperation['input']>(
    input: I,
    _context: BreadOperationContext<TOperation, TAuth>
  ): Promise<I> {
    return input;
  }

  private async postProcess<O extends TOperation['output']>(
    output: O,
    _context: BreadOperationContext<TOperation, TAuth>
  ): Promise<O> {
    return output;
  }
}

import { BreadAuthStrategy } from '../auth-strategy';
import {
  BreadCollectionOperation,
  BreadOperation,
  BreadOperationContext
} from '../operation';
import { BreadServiceAdapter } from '../service-adapter';
import { BreadStateAdapter } from '../state';
import { AllPagesGenerator } from './all-pages-generator';

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
  allPagesGenerator: AllPagesGenerator;

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
  ) {
    this.allPagesGenerator = new AllPagesGenerator(input => this.invoke(input));
  }

  async invoke<O extends TOperation>(input: O['input']): Promise<O['output']> {
    const context = this.createContext(input.breadId);

    return this.preProcess(input, context)
      .then(input => this.process(input, context))
      .then(output => this.postProcess(output, context));
  }

  allPages<
    O extends Extract<
      TOperation,
      // TODO: replace with
      //  `BreadCollectionOperation<TOperation['name'], BreadOperationPaginationType>`
      //   and debug the tsc error
      BreadCollectionOperation<TOperation['name'], any>
    >
  >(input: O['input']): AsyncGenerator<O['output'], void, unknown> {
    return this.allPagesGenerator.generate<O>(input);
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

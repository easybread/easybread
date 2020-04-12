import { BreadAuthStrategy } from '../auth-strategy';
import { BreadOperation, BreadOperationContext } from '../operation';
import { BreadServiceAdapter } from '../service-adapter';
import { BreadStateAdapter } from '../state';

/**
 * Main library class.
 *
 * @template T Defines Operations the client can handle.
 *
 * @param stateAdapter state adapter to use for persistence (save tokens & etc)
 *
 * @param serviceAdapter a "plugin" service adapter.
 *                       Provides logic for requesting and transforming data
 */
export class EasyBreadClient<
  T extends BreadOperation<string>,
  A extends BreadAuthStrategy<object>
> {
  constructor(
    private readonly stateAdapter: BreadStateAdapter,
    private readonly serviceAdapter: BreadServiceAdapter<T, A>,
    private readonly authStrategy: A
  ) {}

  async invoke<O extends T>(input: O['input']): Promise<O['output']> {
    const context = this.createContext(input.breadId);

    return this.preProcess(input, context)
      .then((input) => this.process(input, context))
      .then((output) => this.postProcess(output, context));
  }

  private createContext(breadId: string): BreadOperationContext<T, A> {
    return new BreadOperationContext({
      state: this.stateAdapter,
      auth: this.authStrategy,
      client: this,
      breadId
    });
  }

  private async process<O extends T>(
    input: O['input'],
    context: BreadOperationContext<T, A>
  ): Promise<O['output']> {
    try {
      return await this.serviceAdapter.processOperation(input, context);
    } catch (error) {
      return {
        provider: error.provider || 'unknown',
        name: input.name,
        rawPayload: { success: false, error }
      };
    }
  }

  private async preProcess<I extends T['input']>(
    input: I,
    _context: BreadOperationContext<T, A>
  ): Promise<I> {
    return input;
  }

  private async postProcess<O extends T['output']>(
    output: O,
    _context: BreadOperationContext<T, A>
  ): Promise<O> {
    return output;
  }
}

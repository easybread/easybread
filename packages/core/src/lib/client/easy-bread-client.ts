import { BreadAuthStrategy } from '../auth-strategy';
import { BreadCollectionOperation, BreadOperationContext } from '../operation';
import { BreadServiceAdapter } from '../service-adapter';
import { BreadStateAdapter } from '../state';
import { AllPagesGenerator } from './all-pages-generator';
import { BreadEventBus } from '../event-bus/bread-event.bus';
import type { EasyBreadClientEvent } from './events/easy-bread-client.event';
import type { InferServiceAdapterOperation } from '../service-adapter/bread-service-adapter';

/**
 * Main library class.
 */
export class EasyBreadClient<
  TServiceAdapter extends BreadServiceAdapter<any, TAuthAdapter, any>,
  TAuthAdapter extends BreadAuthStrategy<object>
> extends BreadEventBus<EasyBreadClientEvent> {
  allPagesGenerator: AllPagesGenerator;

  /**
   * @param stateAdapter state adapter to use for persistence (save tokens & etc.)
   * @param serviceAdapter a "plugin" service adapter.
   *                       Provides logic for requesting and transforming data
   * @param authStrategy an Auth strategy to use
   */
  constructor(
    private readonly stateAdapter: BreadStateAdapter,
    private readonly serviceAdapter: TServiceAdapter,
    private readonly authStrategy: TAuthAdapter
  ) {
    super();

    this.authStrategy.forwardEvents(this);

    this.allPagesGenerator = new AllPagesGenerator((input) =>
      this.invoke(input)
    );
  }

  async invoke<
    TOperation extends InferServiceAdapterOperation<TServiceAdapter>
  >(input: TOperation['input']): Promise<TOperation['output']> {
    const context = this.createContext(input.breadId);

    return this.preProcess(input, context)
      .then((input) => this.process(input, context))
      .then((output) => this.postProcess(output, context));
  }

  allPages<
    O extends Extract<
      InferServiceAdapterOperation<TServiceAdapter>,
      BreadCollectionOperation<any, any, any>
    >
  >(input: O['input']): AsyncGenerator<O['output'], void, unknown> {
    return this.allPagesGenerator.generate<O>(input);
  }

  async unAuthenticate(breadId: string): Promise<void> {
    await this.authStrategy.unAuthenticate(breadId);
  }

  private createContext(breadId: string): BreadOperationContext<TAuthAdapter> {
    return new BreadOperationContext({
      state: this.stateAdapter,
      auth: this.authStrategy,
      breadId,
    });
  }

  private async process<
    O extends InferServiceAdapterOperation<TServiceAdapter>
  >(
    input: O['input'],
    context: BreadOperationContext<TAuthAdapter>
  ): Promise<O['output']> {
    return await this.serviceAdapter.processOperation(input, context);
  }

  private async preProcess<
    I extends InferServiceAdapterOperation<TServiceAdapter>['input']
  >(input: I, _context: BreadOperationContext<TAuthAdapter>): Promise<I> {
    return input;
  }

  private async postProcess<
    O extends InferServiceAdapterOperation<TServiceAdapter>['output']
  >(output: O, _context: BreadOperationContext<TAuthAdapter>): Promise<O> {
    // TODO: remove this later hack later.
    //   we should instead support optional serialization/deserialization
    return JSON.parse(JSON.stringify(output));
  }
}

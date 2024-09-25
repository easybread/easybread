import { BreadAuthStrategy } from '../auth-strategy';
import { BreadServiceAdapterOptions } from '../common-interfaces';
import {
  BreadCollectionOperation,
  BreadOperation,
  BreadOperationContext,
} from '../operation';
import { BreadServiceAdapter } from '../service-adapter';
import { BreadStateAdapter } from '../state';
import { AllPagesGenerator } from './all-pages-generator';
import { BreadEventBus } from '../event-bus/bread-event.bus';
import type { EasyBreadClientEvent } from './events/easy-bread-client.event';

/**
 * Main library class.
 *
 * @template TOperation Defines Operations the client can handle.
 * @template TAuth Defines Auth Strategy the client is going to use.
 * @template TOptions Service adapter options
 */
export class EasyBreadClient<
  TOperation extends BreadOperation<string>,
  TAuth extends BreadAuthStrategy<object>,
  TOptions extends BreadServiceAdapterOptions | null = null
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
    private readonly serviceAdapter: BreadServiceAdapter<
      TOperation,
      TAuth,
      TOptions
    >,
    private readonly authStrategy: TAuth
  ) {
    super();

    this.authStrategy.forwardEvents(this);

    this.allPagesGenerator = new AllPagesGenerator((input) =>
      this.invoke(input)
    );
  }

  async invoke<O extends TOperation>(input: O['input']): Promise<O['output']> {
    const context = this.createContext(input.breadId);

    return this.preProcess(input, context)
      .then((input) => this.process(input, context))
      .then((output) => this.postProcess(output, context));
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

  async unAuthenticate(breadId: string): Promise<void> {
    await this.authStrategy.unAuthenticate(breadId);
  }

  private createContext(
    breadId: string
  ): BreadOperationContext<TOperation, TAuth, TOptions> {
    return new BreadOperationContext({
      state: this.stateAdapter,
      auth: this.authStrategy,
      client: this,
      breadId,
    });
  }

  private async process<O extends TOperation>(
    input: O['input'],
    context: BreadOperationContext<TOperation, TAuth, TOptions>
  ): Promise<O['output']> {
    return await this.serviceAdapter.processOperation(input, context);
  }

  private async preProcess<I extends TOperation['input']>(
    input: I,
    _context: BreadOperationContext<TOperation, TAuth, TOptions>
  ): Promise<I> {
    return input;
  }

  private async postProcess<O extends TOperation['output']>(
    output: O,
    _context: BreadOperationContext<TOperation, TAuth, TOptions>
  ): Promise<O> {
    // TODO: remove this later hack later.
    //   we should instead support optional serialization/deserialization
    return JSON.parse(JSON.stringify(output));
  }
}

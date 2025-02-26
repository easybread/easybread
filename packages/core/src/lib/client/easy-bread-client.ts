import type { DistributedOmit } from '@easybread/common';

import { BreadAuthStrategy } from '../auth-strategy';
import { BreadEventBus } from '../event-bus/bread-event.bus';
import { BreadOperationContext } from '../operation';
import {
  BreadServiceAdapter,
  type InferServiceAdapterCollectionOperationByName,
  type InferServiceAdapterCollectionOperationName,
  type InferServiceAdapterOperation,
  type InferServiceAdapterOperationByName,
  type InferServiceAdapterOperationName,
} from '../service-adapter';
import { BreadStateAdapter } from '../state';

import { AllPagesGenerator } from './all-pages-generator';
import type { EasyBreadClientEvent } from './events/easy-bread-client.event';

/**
 * Main library class.
 */
export class EasyBreadClient<
  TServiceAdapter extends BreadServiceAdapter<any, TAuthAdapter, any>,
  TAuthAdapter extends BreadAuthStrategy<object>,
  TOperation extends
    InferServiceAdapterOperation<TServiceAdapter> = InferServiceAdapterOperation<TServiceAdapter>,
> extends BreadEventBus<EasyBreadClientEvent> {
  allPagesGenerator: AllPagesGenerator<TServiceAdapter>;

  /**
   * @param stateAdapter state adapter to use for persistence (save tokens & etc.)
   * @param serviceAdapter a "plugin" service adapter.
   *                       Provides logic for requesting and transforming data
   * @param authStrategy an Auth strategy to use
   */
  constructor(
    private readonly stateAdapter: BreadStateAdapter,
    private readonly serviceAdapter: TServiceAdapter,
    private readonly authStrategy: TAuthAdapter,
  ) {
    super();

    this.authStrategy.forwardEvents(this);

    this.allPagesGenerator = new AllPagesGenerator<TServiceAdapter>(
      (name, data) => this.invoke(name, data),
    );
  }

  async invoke<TName extends InferServiceAdapterOperationName<TServiceAdapter>>(
    name: TName,
    data: DistributedOmit<
      InferServiceAdapterOperationByName<TServiceAdapter, TName>['input'],
      'name'
    >,
  ): Promise<
    InferServiceAdapterOperationByName<TServiceAdapter, TName>['output']
  > {
    const input: TOperation['input'] = { name, ...data };

    const context = this.createContext(input['breadId']);

    return this.preProcess(input, context)
      .then(input => this.process(input, context))
      .then(output => this.postProcess(output, context));
  }

  allPages<
    TName extends InferServiceAdapterCollectionOperationName<TServiceAdapter>,
  >(
    name: TName,
    data: DistributedOmit<
      InferServiceAdapterCollectionOperationByName<
        TServiceAdapter,
        TName
      >['input'],
      'name'
    >,
  ) {
    return this.allPagesGenerator.generate<
      InferServiceAdapterCollectionOperationByName<TServiceAdapter, TName>
    >(name, data);
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
    O extends InferServiceAdapterOperation<TServiceAdapter>,
  >(
    input: O['input'],
    context: BreadOperationContext<TAuthAdapter>,
  ): Promise<O['output']> {
    return await this.serviceAdapter.processOperation(input, context);
  }

  private async preProcess<I extends TOperation['input']>(
    input: I,
    _context: BreadOperationContext<TAuthAdapter>,
  ): Promise<I> {
    return input;
  }

  private async postProcess<O extends TOperation['output']>(
    output: O,
    _context: BreadOperationContext<TAuthAdapter>,
  ): Promise<O> {
    // TODO: remove this later hack.
    //   we should instead support optional serialization/deserialization
    return JSON.parse(JSON.stringify(output));
  }
}

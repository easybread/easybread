import type { Simplify } from '@easybread/common';

import { CommandContext } from '../command-context';
import { BreadEventBus } from '../event-bus/bread-event.bus';
import type {
  ServiceAdapterAny,
  inferServiceAdapterAuth,
  inferServiceAdapterCommandInputByName,
  inferServiceAdapterCommandName,
  inferServiceAdapterCommandOutputByName,
} from '../service-adapter';
import { StateAdapter } from '../state';

import type { EasyBreadClientEvent } from './events/easy-bread-client.event';

/**
 * Main library class.
 */
export class EasyBreadClient<
  TAdapter extends ServiceAdapterAny,
> extends BreadEventBus<EasyBreadClientEvent> {
  readonly stateAdapter: StateAdapter;
  readonly serviceAdapter: TAdapter;

  /**
   * @param stateAdapter state adapter to use for persistence (save tokens & etc.)
   * @param serviceAdapter a "plugin" service adapter.
   *                       Provides logic for requesting and transforming data
   */
  constructor(stateAdapter: StateAdapter, serviceAdapter: TAdapter) {
    super();
    this.serviceAdapter = serviceAdapter;
    this.stateAdapter = stateAdapter;

    this.serviceAdapter.auth.forwardEvents(this);
  }

  // TODO: figure out what variant is better
  // async invoke<
  //   TName extends inferServiceAdapterCommandName<TAdapter>,
  //   TCmd extends inferServiceAdapterCommandByName<
  //     TAdapter,
  //     TName
  //   > = inferServiceAdapterCommandByName<TAdapter, TName>,
  // >(
  //   name: TName,
  //   input: Simplify<inferCommandInput<TCmd>>,
  // ): Promise<Simplify<inferCommandOutput<TCmd>>> {
  //   const context = this.createContext(input.breadId);
  //
  //   return this.preProcess(name, input, context)
  //     .then(input => this.process(name, input, context))
  //     .then(output => this.postProcess(name, output, context));
  // }

  async invoke<TName extends inferServiceAdapterCommandName<TAdapter>>(
    name: TName,
    input: Simplify<inferServiceAdapterCommandInputByName<TAdapter, TName>>,
  ): Promise<
    Simplify<inferServiceAdapterCommandOutputByName<TAdapter, TName>>
  > {
    const context = this.createContext(input.breadId);

    return this.preProcess(name, input, context)
      .then(input => this.process(name, input, context))
      .then(output => this.postProcess(name, output, context));
  }

  async unAuthenticate(breadId: string): Promise<void> {
    await this.serviceAdapter.auth.unAuthenticate(breadId);
  }

  private createContext(
    breadId: string,
  ): CommandContext<inferServiceAdapterAuth<TAdapter>> {
    return new CommandContext({
      breadId,
      provider: this.serviceAdapter.provider,
      state: this.stateAdapter,
      auth: this.serviceAdapter.auth,
    });
  }

  private async process<TName extends inferServiceAdapterCommandName<TAdapter>>(
    name: TName,
    input: inferServiceAdapterCommandInputByName<TAdapter, TName>,
    context: CommandContext<inferServiceAdapterAuth<TAdapter>>,
  ): Promise<inferServiceAdapterCommandOutputByName<TAdapter, TName>> {
    return await this.serviceAdapter.processCommand(name, input, context);
  }

  private async preProcess<TName, TInput, TContext>(
    _name: TName,
    input: TInput,
    _context: TContext,
  ): Promise<TInput> {
    return input;
  }

  private async postProcess<TName, TOutput, TContext>(
    _name: TName,
    output: TOutput,
    _context: TContext,
  ): Promise<Simplify<TOutput>> {
    // TODO: remove this hack.
    //   we should instead support optional serialization/deserialization
    return JSON.parse(JSON.stringify(output));
  }
}

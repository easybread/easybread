import type {
  EasyBreadClientAny,
  inferCommandInput,
  inferCommandOutput,
  inferCommandOutputSuccessful,
  inferEasyBreadClientCommandByName,
  inferEasyBreadClientCommandName,
} from '@easybread/core';

import { NodeExecutionError } from '../../Error';
import { EXIT_STATUS } from '../../Exit';
import { Intent } from '../../Intent';
import { Option } from '../../helpers/Option';
import type { Fiber } from '../Fiber';
import { makePipeFiberPolicy } from '../FiberPolicy';
import {
  type OnCloseResultIntents,
  PipeNode,
  type inferNodeRunContext,
  type inferNodeRunReturn,
} from '../Node';
import { type NodeStatePolicyNone, noneStatePolicy } from '../NodeStatePolicy';

export class CommandNode<
  TId extends string,
  TClient extends EasyBreadClientAny,
  TCommandName extends inferEasyBreadClientCommandName<TClient>,
  TCommand extends inferEasyBreadClientCommandByName<
    TClient,
    TCommandName
  > = inferEasyBreadClientCommandByName<TClient, TCommandName>,
> extends PipeNode<
  TId,
  NodeStatePolicyNone,
  inferCommandInput<TCommand>,
  inferCommandOutputSuccessful<TCommand>,
  inferCommandOutputSuccessful<TCommand>
> {
  fiberPolicy = makePipeFiberPolicy();
  statePolicy = noneStatePolicy();

  protected client: TClient;
  protected commandName: TCommandName;

  constructor(id: TId, client: TClient, commandName: TCommandName) {
    super(id, []);
    this.client = client;
    this.commandName = commandName;
  }

  async run(context: inferNodeRunContext<this>): inferNodeRunReturn<this> {
    const input = await context.loadInputFiberData(context.inputFiber);
    const result: inferCommandOutput<TCommand> = await this.client.invoke(
      this.commandName,
      input,
    );

    if (!result.success) {
      throw new NodeExecutionError(this.id, this.type, result);
    }

    return [
      Intent.closeFiber({
        fiber: context.runFiber,
        // TODO: avoid type assertion
        data: Option.some(result as inferCommandOutputSuccessful<TCommand>),
      }),
    ];
  }

  async onClose(fiber: Fiber): Promise<OnCloseResultIntents[]> {
    return [Intent.exit({ exit: { status: EXIT_STATUS.enum.SUCCESS }, fiber })];
  }
}

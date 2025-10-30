import { Intent } from '../../Intent';
import type { IOConstraintArray } from '../../helpers/IO';
import { Option } from '../../helpers/Option';
import { makeForkFiberPolicy } from '../FiberPolicy';
import {
  ForkNode,
  type OnCloseResultIntents,
  type OnExitResultIntents,
  type inferNodeEventHandlerContext,
  type inferNodeRunContext,
  type inferNodeRunReturn,
} from '../Node';
import { type NodeStatePolicyNone, noneStatePolicy } from '../NodeStatePolicy';

export class EnumNode<
  TName extends string,
  TIn extends IOConstraintArray,
> extends ForkNode<TName, NodeStatePolicyNone, TIn, TIn[number], TIn[number]> {
  fiberPolicy = makeForkFiberPolicy();
  statePolicy = noneStatePolicy();

  makeNumberToFork(inputData: TIn): number {
    return inputData.length;
  }

  async run(context: inferNodeRunContext<this>): inferNodeRunReturn<this> {
    const runFiber = context.runFiber;
    const inputData = await context.loadInputFiberData(context.inputFiber);

    return [
      Intent.closeFiber({
        fiber: runFiber,
        data: Option.some(inputData[runFiber.ordinality]),
      }),
    ];
  }

  async onClose(
    context: inferNodeEventHandlerContext<this>,
  ): Promise<OnCloseResultIntents[]> {
    // exit if all items have been emitted.
    // i.e. if all fibers in the scope are closed, exit
    // we don't want to load all members every time
    // it can be hundreds of items... on every onClose call... crazy!!!
    // So we better use node state counters.
    // if number of open fibers is 0 by this time - we are ready to close
    return [];
  }

  async onExit(): Promise<OnExitResultIntents[]> {
    return [];
  }
}

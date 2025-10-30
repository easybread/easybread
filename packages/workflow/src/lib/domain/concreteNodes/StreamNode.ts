import { Intent } from '../../Intent';
import type { GetIO, IOConstraint, IOIn, IOOut } from '../../helpers/IO';
import { Option } from '../../helpers/Option';
import { EXIT_STATUS } from '../Exit';
import { makePipeFiberPolicy } from '../FiberPolicy';
import {
  type NodeAny,
  type NodeAnyWithSpecificInput,
  type OnCloseResultIntents,
  type OnExitResultIntents,
  PipeNode,
  type inferNodeEventHandlerContext,
  type inferNodeRunContext,
  type inferNodeRunReturn,
} from '../Node';
import { type NodeStatePolicyNone, noneStatePolicy } from '../NodeStatePolicy';

type IsEmptyNodeChildren<T extends ReadonlyArray<NodeAny>> = T extends never[]
  ? true
  : false;

/**
 * A node that runs its children sequentially, one after another.
 *
 * Propagates the last child node's close event.
 *
 * Does not propagate the close event when it has no next child node.
 *
 * Exits when all direct children have exited and there are no pending
 * tasks for them on fibers that have this node's run fiber as their origin.
 *
 * @example
 * ```
 * const node = StreamNode.empty('r')
 *   .addChild(new FunctionNode('f1', (input: { foo: 'a' }) => {
 *     return { return: input.foo };
 *   }))
 *   .addChild(new FunctionNode('f2', (input: { return: 'a' }) => {
 *     return { return: `${input.return} b` as const };
 *   }));
 * ```
 */
export class StreamNode<
  TName extends string,
  TIn extends IOConstraint = null,
  TOut extends IOConstraint = null,
  TChildren extends ReadonlyArray<NodeAny> = [],
> extends PipeNode<TName, NodeStatePolicyNone, TIn, TOut, TIn, TChildren> {
  static empty<TName extends string>(id: TName) {
    return new StreamNode(id, []);
  }

  fiberPolicy = makePipeFiberPolicy();
  statePolicy = noneStatePolicy();

  private constructor(id: TName, children: TChildren) {
    super(id, children);
  }

  async run(context: inferNodeRunContext<this>): inferNodeRunReturn<this> {
    const inputData = await context.loadInputFiberData(context.inputFiber);
    return [
      Intent.closeFiber({
        fiber: context.runFiber,
        data: Option.some(inputData),
      }),
    ];
  }

  async onClose(
    context: inferNodeEventHandlerContext<this>,
  ): Promise<OnCloseResultIntents[]> {
    const nextNode = this.getNextNode(context.eventFiber.nodeId);

    if (nextNode) {
      return [
        Intent.runNode({ fiber: context.eventFiber, nodeId: nextNode.id }),
        Intent.stopPropagation({ reason: 'StreamNode has next child node.' }),
      ];
    }

    return [];
  }

  async onExit(
    context: inferNodeEventHandlerContext<this>,
  ): Promise<OnExitResultIntents[]> {
    /* 
    Exit Store
    nodeId        fiberKey       status       fiberCloseData (in another store)
    r             -              -------
    r/a           -/-            SUCCESS      [T1, T2, T3]
    r/e           -/-/0          -------      T1
    r/e/foo       -/-/0/-        SUCCESS      T1-foo
    r/batch       -/-/0/-/0      -------      [T1-foo]
    r/e           -/-/1          -------      T2
    r/e/foo       -/-/1/-        SUCCESS      T2-foo
    r/batch       -/-/1/-/0      -------      [T1-foo, T2-foo]
    r/e           -/-/2          SUCCESS      T3
    r/e/foo       -/-/2/-        SUCCESS      T3-foo
    r/batch       -/-/2/-/0      SUCCESS      [T1-foo, T2-foo, T3-foo]
    r             -              SUCCESS
    
    const exits = await context.exitStore.getExits('r/*', '-/**')
    */
    const tasksCount = await context.countPendingChildrenTasks(this);

    const exitsCount = 10;

    if (tasksCount > 0) return [];
    // this doesn't solve the problem. Children can exit multiple times. see the notepad.
    if (exitsCount < this.childrenCount) return [];

    return [
      Intent.exit({
        fiber: context.eventFiber,
        exit: { status: EXIT_STATUS.enum.SUCCESS },
      }),
    ];
  }

  addChild<
    C extends IsEmptyNodeChildren<TChildren> extends true
      ? NodeAny
      : NodeAnyWithSpecificInput<TOut>,
  >(child: C) {
    return new StreamNode<
      TName,
      IsEmptyNodeChildren<TChildren> extends true ? IOIn<GetIO<C>> : TIn,
      IOOut<GetIO<C>>,
      IsEmptyNodeChildren<TChildren> extends true ? [C] : [...TChildren, C]
    >(this.name, [...this.childrenArray, child] as any);
  }

  private getNextNode(prevNodeId: string): TChildren[number] | null {
    if (prevNodeId === this.id) {
      return this.getFirst();
    }

    const prevNodeIndex = this.childrenArray.findIndex(
      n => n.id === prevNodeId,
    );

    if (prevNodeIndex === -1) {
      throw new Error(`Node ${prevNodeId} not found`);
    }

    return this.childrenArray[prevNodeIndex + 1] || null;
  }

  private getFirst(): TChildren[number] | null {
    return this.childrenArray[0] || null;
  }
}

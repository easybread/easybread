import { Intent } from '../../Intent';
import type { GetIO, IOConstraint, IOIn, IOOut } from '../../helpers/IO';
import { Option } from '../../helpers/Option';
import type { Fiber } from '../Fiber';
import { makePipeFiberPolicy } from '../FiberPolicy';
import {
  type NodeAny,
  type NodeAnyWithSpecificInput,
  type OnCloseResultIntents,
  PipeNode,
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
 * Exits when the last child node exits.
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

  async onClose(fiber: Fiber): Promise<OnCloseResultIntents[]> {
    const nextNode = this.getNextNode(fiber.nodeId);

    if (nextNode) {
      return [
        Intent.stopPropagation({
          reason: 'StreamNode has next child node',
        }),
        Intent.runNode({ fiber, nodeId: nextNode.id }),
      ];
    }

    return [];
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
    >(this.id, [...this.childrenArray, child] as any);
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

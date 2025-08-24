import { Intent, RunNodeIntent, StopPropagationIntent } from '../../Intent';
import type { GetIO, IOConstraint, IOOut } from '../../helpers/IO';
import { Option } from '../../helpers/Option';
import type { Fiber } from '../Fiber';
import { FIBER_POLICY_TYPE, type ForkFiberPolicy } from '../FiberPolicy';
import {
  ForkNode,
  type NodeAnyWithSpecificInput,
  type OnCloseResultIntents,
  type inferNodeRunContext,
  type inferNodeRunReturn,
} from '../Node';
import { type NodeStatePolicyNone, noneStatePolicy } from '../NodeStatePolicy';

// Helper type to ensure all children have the same input type
type StrictSameInputChildren<
  TIn extends IOConstraint,
  TChildren extends ReadonlyArray<NodeAnyWithSpecificInput<TIn>>,
> =
  TChildren extends ReadonlyArray<NodeAnyWithSpecificInput<TIn>>
    ? TChildren
    : never;

/**
 * It is a fork node that runs all its children concurrently,
 * and propagates the close of children fobers to the parent node as soon as they close.
 *
 * Exits when all children have exited.
 */
export class ConcurrentNode<
  TId extends string,
  TIn extends IOConstraint,
  TChildren extends ReadonlyArray<NodeAnyWithSpecificInput<TIn>>,
> extends ForkNode<
  TId,
  NodeStatePolicyNone,
  TIn,
  IOOut<GetIO<TChildren[number]>>,
  TIn,
  TChildren
> {
  statePolicy = noneStatePolicy();

  /** Fork a fiber for each child node. */
  get fiberPolicy(): ForkFiberPolicy {
    return {
      type: FIBER_POLICY_TYPE.enum.FORK,
      forkCount: Object.keys(this.children).length,
    };
  }

  private nodeIdByOrdinality: Map<number, string> = new Map();

  constructor(id: TId, children: StrictSameInputChildren<TIn, [...TChildren]>) {
    super(id, children);
    children.forEach((child, index) => {
      this.nodeIdByOrdinality.set(index, child.id);
    });
  }

  /**
   * Closes run fibers worwarding the input data.
   */
  async run(context: inferNodeRunContext<this>): inferNodeRunReturn<this> {
    const inputData = await context.loadInputFiberData(context.inputFiber);

    // TODO: design a way to forward the same data reference instead of creating a new data store record
    return context.runFibers.map(fiber => {
      return Intent.closeFiber({ fiber, data: Option.some(inputData) });
    });
  }

  /**
   * - for own fiber - runs a corresponding to fiber's ordinality child node and stops propagation.
   * - for children fibers - does nothing, letting the event to propagate.
   */
  async onClose(fiber: Fiber): Promise<OnCloseResultIntents[]> {
    if (fiber.nodeId !== this.id) return [];

    const nodeId = this.getTargetNodeId(fiber.ordinality);

    return [
      new RunNodeIntent({ fiber, nodeId }),
      new StopPropagationIntent({ reason: 'ConcurrentNode own close event' }),
    ];
  }

  private getTargetNodeId(ordinality: number): string {
    const targetNodeId = this.nodeIdByOrdinality.get(ordinality);
    if (!targetNodeId) {
      // TODO: custom error for this
      throw new Error('Target node not found');
    }
    return targetNodeId;
  }
}

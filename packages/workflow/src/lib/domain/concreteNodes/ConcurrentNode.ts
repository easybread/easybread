import { INTENT_TYPE } from '../../Intent';
import type { GetIO, IOConstraint, IOOut } from '../../helpers/IO';
import { Option } from '../../helpers/Option';
import {
  FIBER_POLICY_TYPE,
  type FiberPolicy,
  type ForkFiberPolicy,
} from '../FiberPolicy';
import {
  ForkNode,
  Node,
  type inferNodeRunContext,
  type inferNodeRunReturn,
} from '../Node';
import type { NodeStatePolicy, NodeStatePolicyNone } from '../NodeStatePolicy';

// Helper type to ensure all children have the same input type
type AllChildrenHaveSameInput<
  TIn extends IOConstraint,
  TChildren extends ReadonlyArray<
    Node<string, FiberPolicy, NodeStatePolicy, TIn, IOConstraint, any>
  >,
> =
  TChildren extends ReadonlyArray<
    Node<string, ForkFiberPolicy, NodeStatePolicy, TIn, IOConstraint, any>
  >
    ? TChildren
    : never;

export class ConcurrentNode<
  TId extends string,
  TIn extends IOConstraint,
  TChildren extends ReadonlyArray<
    Node<string, ForkFiberPolicy, NodeStatePolicy, TIn, IOConstraint, any>
  >,
> extends ForkNode<
  TId,
  NodeStatePolicyNone,
  TIn,
  IOOut<GetIO<TChildren[number]>>,
  TIn,
  TChildren
> {
  statePolicy: NodeStatePolicyNone = { type: 'NONE' };

  get fiberPolicy(): ForkFiberPolicy {
    return {
      type: FIBER_POLICY_TYPE.enum.FORK,
      forkCount: Object.keys(this.children).length,
    };
  }

  children: {
    [ChildrenID in TChildren[number]['id']]: TChildren[number] & {
      id: ChildrenID;
    };
  };

  constructor(
    id: TId,
    children: AllChildrenHaveSameInput<TIn, [...TChildren]>,
  ) {
    super(id, children);

    this.children = children.reduce(
      (acc, child) => {
        acc[child.id as TChildren[number]['id']] = child;
        return acc;
      },
      {} as {
        [ChildrenID in TChildren[number]['id']]: TChildren[number] & {
          id: ChildrenID;
        };
      },
    );
  }

  async run(context: inferNodeRunContext<this>): inferNodeRunReturn<this> {
    const inputFiberClose = await context.loadInputFiberData(
      context.inputFiber,
    );
    return context.runFibers.map(fiber => ({
      type: INTENT_TYPE.enum.CLOSE_FIBER,
      payload: { fiber, close: Option.some(inputFiberClose) },
    }));
  }
}

import type { GetIO, IOConstraint, IOOut } from '../../helpers/IO';
import {
  FIBER_POLICY_TYPE,
  type FiberPolicy,
  type ForkFiberPolicy,
} from '../FiberPolicy';
import { Node } from '../Node';
import { NodeRunContextBase } from '../NodeRunContext';

// Helper type to ensure all children have the same input type
type AllChildrenHaveSameInput<
  TInput extends IOConstraint,
  TChildren extends ReadonlyArray<
    Node<string, TInput, IOConstraint, FiberPolicy, any>
  >,
> =
  TChildren extends ReadonlyArray<
    Node<string, TInput, IOConstraint, FiberPolicy, any>
  >
    ? TChildren
    : never;

export class ConcurrentNode<
  TId extends string,
  TInput extends IOConstraint,
  TChildren extends ReadonlyArray<
    Node<string, TInput, IOConstraint, FiberPolicy, any>
  >,
> extends Node<
  TId,
  TInput,
  IOOut<GetIO<TChildren[number]>>,
  ForkFiberPolicy,
  never
> {
  children: {
    [ChildrenID in TChildren[number]['id']]: TChildren[number] & {
      id: ChildrenID;
    };
  };

  constructor(
    id: TId,
    children: AllChildrenHaveSameInput<TInput, [...TChildren]>,
  ) {
    super(id);

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

  get fiberPolicy(): ForkFiberPolicy {
    return {
      type: FIBER_POLICY_TYPE.enum.WORKFLOW_FORK,
      forkCount: Object.keys(this.children).length,
    };
  }

  run(context: NodeRunContextBase<this>): void {
    throw new Error('Method not implemented.');
  }
}

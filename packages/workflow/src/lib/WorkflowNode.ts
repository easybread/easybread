import {
  type GetIO,
  type IO,
  type IOConstraint,
  type IOIn,
  type IOOut,
  WithIO,
} from './helpers/IO';
import type { Fiber } from './store/Fiber';
import {
  FIBER_POLICY_TYPE,
  type FiberPolicy,
  type WorkflowForkPolicy,
} from './store/FiberPolicy';

export interface NodeRunContext<N extends WorkflowNodeAny> {
  state: N extends WorkflowNode<any, any, any, any, infer S> ? S : never;
  runFiber: Fiber<IOOut<GetIO<N>>>;
  inputFiber?: Fiber<IOIn<GetIO<N>>>;
}

export abstract class WorkflowNode<
  TId extends string,
  TIn extends IOConstraint,
  TOut extends IOConstraint,
  TFp extends FiberPolicy,
  _TState extends IOConstraint | never,
> extends WithIO<IO<TIn, TOut>> {
  readonly id: TId;
  readonly children: Record<string, WorkflowNodeAny> = {};

  constructor(id: TId) {
    super();
    this.id = id;
  }

  abstract get fiberPolicy(): TFp;

  runForTS(_input: TIn): TOut | Promise<TOut> {
    throw new Error('Method not implemented.');
  }

  abstract run(context: NodeRunContext<this>): void;
}

export type WorkflowNodeAny = WorkflowNode<
  string,
  IOConstraint,
  IOConstraint,
  FiberPolicy,
  any
>;

export class FunctionNode<
  TID extends string,
  TIn extends IOConstraint,
  TOut extends IOConstraint,
> extends WorkflowNode<TID, TIn, TOut, FiberPolicy, never> {
  run(context: NodeRunContext<this>): void {
    throw new Error('Method not implemented.');
  }
  fn: (input: TIn) => TOut | Promise<TOut>;

  get fiberPolicy(): FiberPolicy {
    return { type: FIBER_POLICY_TYPE.enum.PIPE };
  }

  constructor(id: TID, fn: (input: TIn) => TOut | Promise<TOut>) {
    super(id);
    this.fn = fn;
  }
}

// Helper type to ensure all children have the same input type
type AllChildrenHaveSameInput<
  TInput extends IOConstraint,
  TChildren extends ReadonlyArray<
    WorkflowNode<string, IO<any, any>, FiberPolicy, any>
  >,
> =
  TChildren extends ReadonlyArray<
    WorkflowNode<string, IO<TInput, any>, FiberPolicy, any>
  >
    ? TChildren
    : never;

export class ConcurrentNode<
  TId extends string,
  TInput extends IOConstraint,
  TChildren extends ReadonlyArray<
    WorkflowNode<string, IO<TInput, any>, FiberPolicy, any>
  >,
> extends WorkflowNode<
  TId,
  IO<TInput, IOOut<GetIO<TChildren[number]>>>,
  WorkflowForkPolicy,
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

  get fiberPolicy(): WorkflowForkPolicy {
    return {
      type: FIBER_POLICY_TYPE.enum.WORKFLOW_FORK,
      forkCount: Object.keys(this.children).length,
    };
  }

  run(context: NodeRunContext<this>): void {
    throw new Error('Method not implemented.');
  }
}

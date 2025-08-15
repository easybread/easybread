import type {
  CloseFiberIntent,
  RunNodeIntent,
  StateUpdateIntent,
  StopPropagationIntent,
} from './Intent';
import {
  type GetIO,
  type IO,
  type IOAny,
  type IOConstraint,
  type IOIn,
  type IOOut,
  WithIO,
} from './helpers/IO';
import { type None, Option } from './helpers/Option';
import type { Fiber, FiberAny } from './store/Fiber';
import {
  FIBER_POLICY_TYPE,
  type FiberPolicy,
  type WorkflowForkPolicy,
} from './store/FiberPolicy';

export interface NodeRunContext<N extends WorkflowNodeAny> {
  state: N extends WorkflowNode<any, any, infer S> ? S : never;
  runFiber: Fiber<Option<IOOut<GetIO<N>>>>;
  inputFiber?: Fiber<Option<IOIn<GetIO<N>>>>;
}

export abstract class WorkflowNode<
  TId extends string,
  Tio extends IOAny,
  FP extends FiberPolicy,
  TState extends IOConstraint | never,
> extends WithIO<Tio> {
  readonly id: TId;
  readonly children: Record<string, WorkflowNodeAny> = {};

  constructor(id: TId) {
    super();
    this.id = id;
  }

  abstract get fiberPolicy(): FP;

  abstract run(
    state: TState extends never ? None : Option<TState>,
    runFiber: Fiber<Option<IOOut<GetIO<this>>>>,
    inputFiber?: Fiber<Option<IOIn<GetIO<this>>>>,
  ): Promise<(StateUpdateIntent | CloseFiberIntent)[]>;

  abstract onFiberClosed(
    fiber: FiberAny,
  ): (StopPropagationIntent | RunNodeIntent)[];

  abstract onNodeExited(node: WorkflowNodeAny): void;
}

// type StreamNode<T extends IOAny> = WorkflowNode<T, None>;

export type WorkflowNodeAny = WorkflowNode<string, IOAny, FiberPolicy, any>;

type FnAny = (input: IOConstraint) => IOConstraint | Promise<IOConstraint>;
type FnIO<F extends FnAny> = F extends (input: infer I) => infer O
  ? I extends IOConstraint
    ? O extends IOConstraint
      ? IO<I, O>
      : never
    : never
  : never;
type FnIn<F extends FnAny> = IOIn<FnIO<F>>;
type FnOut<F extends FnAny> = IOOut<FnIO<F>>;

class FnNode<TId extends string, TFn extends FnAny> extends WorkflowNode<
  TId,
  IO<FnIn<TFn>, FnOut<TFn>>,
  FiberPolicy,
  never
> {
  fn: TFn;

  get fiberPolicy(): FiberPolicy {
    return { type: FIBER_POLICY_TYPE.enum.PIPE };
  }

  constructor(id: TId, fn: TFn) {
    super(id);
    this.fn = fn;
  }

  getNode(id: string): WorkflowNodeAny {
    throw new Error('Method not implemented.');
  }

  run(
    state: None,
    runFiber: Fiber<Option<IOOut<GetIO<this>>>>,
    inputFiber?: Fiber<Option<IOIn<GetIO<this>>>> | undefined,
  ): Promise<(StateUpdateIntent | CloseFiberIntent)[]> {
    throw new Error('Method not implemented.');
  }
  onFiberClosed(fiber: FiberAny): (StopPropagationIntent | RunNodeIntent)[] {
    throw new Error('Method not implemented.');
  }
  onNodeExited(node: WorkflowNodeAny): void {
    throw new Error('Method not implemented.');
  }
}

class ConcurrentNode<
  TId extends string,
  TInput extends IOConstraint,
  TChildren extends WorkflowNode<string, IO<TInput, any>, FiberPolicy, any>[],
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

  constructor(id: TId, children: TChildren) {
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

  run(
    state: None,
    runFiber: Fiber<Option<IOOut<GetIO<this>>>>,
    inputFiber?: Fiber<Option<IOIn<GetIO<this>>>> | undefined,
  ): Promise<(StateUpdateIntent | CloseFiberIntent)[]> {
    throw new Error('Method not implemented.');
  }

  onFiberClosed(fiber: FiberAny): (StopPropagationIntent | RunNodeIntent)[] {
    throw new Error('Method not implemented.');
  }

  onNodeExited(node: WorkflowNodeAny): void {
    throw new Error('Method not implemented.');
  }
}

type I = { q: string };
type O1 = { a: string };
type O2 = { b: string };

const f1: FnAny = (input: I) => ({ a: input.q });

const w = new ConcurrentNode('w', [
  new FnNode('f1', (input: I) => ({ a: input.q })),
  new FnNode('f2', (input: I) => ({ b: input.q })),
]);

type WIO = GetIO<typeof w>;

console.log(w.children.f1.id);
console.log(w.children.f2.id);

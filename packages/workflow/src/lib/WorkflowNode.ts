import {
  type GetIO,
  type IO,
  type IOAny,
  type IOConstraint,
  type IOIn,
  type IOOut,
  WithIO,
} from './helpers/IO';
import { Option } from './helpers/Option';
import type { Fiber } from './store/Fiber';
import {
  FIBER_POLICY_TYPE,
  type FiberPolicy,
  type WorkflowForkPolicy,
} from './store/FiberPolicy';

export interface NodeRunContext<N extends WorkflowNodeAny> {
  state: N extends WorkflowNode<any, any, any, infer S> ? S : never;
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

  run(input: IOIn<Tio>): IOOut<Tio> | Promise<IOOut<Tio>> {
    throw new Error('Method not implemented.');
  }

  // abstract onFiberClosed(
  //   fiber: FiberAny,
  // ): (StopPropagationIntent | RunNodeIntent)[];

  // abstract onNodeExited(node: WorkflowNodeAny): void;
}

// type StreamNode<T extends IOAny> = WorkflowNode<T, None>;

export type WorkflowNodeAny = WorkflowNode<string, IOAny, FiberPolicy, any>;

class FnNode<
  TId extends string,
  TIn extends IOConstraint,
  TOut extends IOConstraint,
> extends WorkflowNode<TId, IO<TIn, TOut>, FiberPolicy, never> {
  fn: (input: TIn) => TOut | Promise<TOut>;

  get fiberPolicy(): FiberPolicy {
    return { type: FIBER_POLICY_TYPE.enum.PIPE };
  }

  constructor(id: TId, fn: (input: TIn) => TOut | Promise<TOut>) {
    super(id);
    this.fn = fn;
  }
}

class ConcurrentNode<
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

  constructor(id: TId, children: [...TChildren]) {
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
}

type I = { q: string };

const fn1 = new FnNode('f1', (input: I) => ({ a: input.q }));
const fn2 = new FnNode('f2', (input: I) => ({ b: input.q }));

const w = new ConcurrentNode('w', [fn1, fn2]);

w.run({ anything: 'is allowed, but should not be.' });

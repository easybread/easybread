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
  _TState extends IOConstraint | never,
> extends WithIO<Tio> {
  readonly id: TId;
  readonly children: Record<string, WorkflowNodeAny> = {};

  constructor(id: TId) {
    super();
    this.id = id;
  }

  abstract get fiberPolicy(): FP;

  run(_input: IOIn<Tio>): IOOut<Tio> | Promise<IOOut<Tio>> {
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
}

// PROBLEMS SECTION

type I1 = { q: string };
type IWrong = { p: string };

// types of fn1 and fn2 seem to be correct.
const fn1 = new FnNode('f1', (input: I1) => ({ a: input.q }));
const fn2 = new FnNode('f2', (input: IWrong) => ({ b: input.p }));

const fn3 = new FnNode('f3', (input: I1) => ({ c: input.q }));

// this should raise TS error because of the different input types of fn1 and fn2
const _cWrong = new ConcurrentNode('c', [fn1, fn2]);

// this should be fine, because the input type of fn1 and fn3 are the same
const cCorrect = new ConcurrentNode('c', [fn1, fn3]);

// this should be I1, not IOConstraint
type _WInput = GetIO<typeof cCorrect>;

// this is ok
const _r1 = cCorrect.run({ q: 'smth' });

// this should raise TS error because input is not assignable to I1
const _r2 = cCorrect.run({ wrongInput: 'smth' });

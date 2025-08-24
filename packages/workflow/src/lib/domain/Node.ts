import type {
  CloseFiberIntent,
  RunNodeIntent,
  StopPropagationIntent,
} from '../Intent';
import {
  type GetIO,
  type IO,
  type IOConstraint,
  type IOIn,
  WithIO,
} from '../helpers/IO';

import {
  type BackpressurePolicy,
  nearestForkBackpressurePolicy,
} from './BackpressurePolicy';
import type { Fiber } from './Fiber';
import {
  FIBER_POLICY_TYPE,
  type FiberPolicy,
  type ForkFiberPolicy,
  type JoinFiberPolicy,
  type PipeFiberPolicy,
} from './FiberPolicy';
import type { NodeRunContext } from './NodeRunContext';
import type { NodeStatePolicy } from './NodeStatePolicy';

const _FP = Symbol('FP');
const _SP = Symbol('SP');
const _CLOSE = Symbol('CLOSE');

export type NodeChildrenMap<TChildren extends ReadonlyArray<NodeAny>> = {
  [ChildrenID in TChildren[number]['id']]: TChildren[number] & {
    id: ChildrenID;
  };
};

export type OnCloseResultIntents = RunNodeIntent | StopPropagationIntent;

export abstract class Node<
  TId extends string,
  TFP extends FiberPolicy,
  TSP extends NodeStatePolicy,
  TIn extends IOConstraint,
  TOut extends IOConstraint,
  TClose extends IOConstraint,
  TChildren extends ReadonlyArray<NodeAny> = [],
> extends WithIO<IO<TIn, TOut>> {
  /**
   * Creates a map of children nodes by their id.
   *
   * @param children - The list of children nodes.
   * @returns A map of children nodes by their id.
   */
  private static makeChildrenMap<TChildren extends ReadonlyArray<NodeAny>>(
    children: TChildren,
  ): NodeChildrenMap<TChildren> {
    return children.reduce((acc, child) => {
      acc[child.id as TChildren[number]['id']] = child;
      return acc;
    }, {} as NodeChildrenMap<TChildren>);
  }

  readonly [_FP] = {} as TFP;
  readonly [_SP] = {} as TSP;
  readonly [_CLOSE] = {} as TClose;

  readonly id: TId;

  protected readonly children: NodeChildrenMap<TChildren>;

  constructor(id: TId, children: TChildren) {
    super();
    this.id = id;
    this.children = Node.makeChildrenMap(children);
  }

  abstract fiberPolicy: TFP;
  abstract statePolicy: TSP;

  readonly backpressurePolicy: BackpressurePolicy =
    nearestForkBackpressurePolicy();

  hasChildren(): this is NodeAny {
    return Object.keys(this.children).length > 0;
  }

  isFork(): this is ForkNodeAny {
    return this.fiberPolicy.type === FIBER_POLICY_TYPE.enum.FORK;
  }

  isJoin(): this is JoinNodeAny {
    return this.fiberPolicy.type === FIBER_POLICY_TYPE.enum.JOIN;
  }

  isPipe(): this is PipeNodeAny {
    return this.fiberPolicy.type === FIBER_POLICY_TYPE.enum.PIPE;
  }

  isStream(): this is StreamNodeAny {
    return this instanceof StreamNode;
  }

  getChild(id: inferNodeId<TChildren[number]>): NodeAny | undefined {
    return this.children[id];
  }

  fiberScopeKey(this: ForkNodeAny | JoinNodeAny, fiber: Fiber): string {
    if (this.isFork()) {
      return fiber.scopeKey(fiber.nodeId, this.fiberPolicy);
    }
    if (this.isJoin()) {
      return fiber.scopeKey(
        this.fiberPolicy.anchor,
        this.fiberPolicy,
        fiber.ordinality,
      );
    }
    throw new Error('This should not be reachable');
  }

  abstract run(context: inferNodeRunContext<this>): inferNodeRunReturn<this>;

  abstract onClose(fiber: Fiber): Promise<OnCloseResultIntents[]>;
}

export abstract class PipeNode<
  TId extends string,
  TSP extends NodeStatePolicy,
  TIn extends IOConstraint,
  TOut extends IOConstraint,
  TClose extends IOConstraint,
  TChildren extends ReadonlyArray<NodeAny> = [],
> extends Node<TId, PipeFiberPolicy, TSP, TIn, TOut, TClose, TChildren> {}

export abstract class StreamNode<
  TId extends string,
  TSP extends NodeStatePolicy,
  TIn extends IOConstraint,
  TOut extends IOConstraint,
  TClose extends IOConstraint,
  TChildren extends ReadonlyArray<NodeAny> = [],
> extends PipeNode<TId, TSP, TIn, TOut, TClose, TChildren> {
  abstract getFirst(): NodeAny | null;
  abstract getPrevious(nodeId: string): NodeAny | null;
  abstract getNext(nodeId: string): NodeAny | null;
}

export abstract class ForkNode<
  TId extends string,
  TSP extends NodeStatePolicy,
  TIn extends IOConstraint,
  TOut extends IOConstraint,
  TClose extends IOConstraint,
  TChildren extends ReadonlyArray<NodeAny> = [],
> extends Node<TId, ForkFiberPolicy, TSP, TIn, TOut, TClose, TChildren> {}

export abstract class JoinNode<
  TId extends string,
  TSP extends NodeStatePolicy,
  TIn extends IOConstraint,
  TOut extends IOConstraint,
  TClose extends IOConstraint,
  TChildren extends ReadonlyArray<NodeAny> = [],
> extends Node<TId, JoinFiberPolicy, TSP, TIn, TOut, TClose, TChildren> {}

export type ForkNodeAny = ForkNode<
  string,
  NodeStatePolicy,
  IOConstraint,
  IOConstraint,
  any,
  any
>;

export type JoinNodeAny = JoinNode<
  string,
  NodeStatePolicy,
  IOConstraint,
  IOConstraint,
  any,
  any
>;

export type PipeNodeAny = PipeNode<
  string,
  NodeStatePolicy,
  IOConstraint,
  IOConstraint,
  any,
  any
>;

// export type NodeAny = ForkNodeAny | JoinNodeAny | PipeNodeAny;
export type NodeAny = Node<
  string,
  FiberPolicy,
  NodeStatePolicy,
  IOConstraint,
  IOConstraint,
  any,
  any
>;

export type StreamNodeAny = StreamNode<
  string,
  NodeStatePolicy,
  IOConstraint,
  IOConstraint,
  any,
  any
>;

export type NodeAnyWithSpecificInput<TIn extends IOConstraint> = Node<
  string,
  FiberPolicy,
  NodeStatePolicy,
  TIn,
  IOConstraint,
  any,
  any
>;

export type inferNodeId<N extends NodeAny> = N['id'];
export type inferNodeFP<N extends NodeAny> = N[typeof _FP];
export type inferNodeSP<N extends NodeAny> = N[typeof _SP];
export type inferNodeClose<N extends NodeAny> = N[typeof _CLOSE];

export type inferNodeRunContext<N extends NodeAny> = NodeRunContext<
  inferNodeFP<N>,
  inferNodeSP<N>,
  IOIn<GetIO<N>>
>;

export type inferNodeRunReturn<N extends NodeAny> = Promise<
  CloseFiberIntent<inferNodeClose<N>>[]
>;

// declare const node: NodeAny;
// declare const nodeA: PipeNode<
//   'testA',
//   NodeStatePolicyNone,
//   { foo: 'a' },
//   { bar: 'a' },
//   { close: 'a' }
// >;

// declare const nodeB: PipeNode<
//   'testB',
//   NodeStatePolicyNone,
//   { foo: 'b' },
//   { bar: 'b' },
//   { close: 'b' },
//   [typeof nodeA]
// >;

// node.run();
// nodeConcrete.run();

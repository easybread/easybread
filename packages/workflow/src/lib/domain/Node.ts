import type {
  CloseFiberIntent,
  ExitIntent,
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
import type { NodeEventHandlerContext, NodeRunContext } from './NodeContext';
import type { NodeStatePolicy } from './NodeStatePolicy';

const _FP = Symbol('FP');
const _SP = Symbol('SP');
const _CLOSE = Symbol('CLOSE');
const _NAME = Symbol('NAME');

type _FPType = typeof _FP;
type _SPType = typeof _SP;
type _CLOSEType = typeof _CLOSE;
type _NAMEType = typeof _NAME;

export type NodeChildrenMap<TChildren extends ReadonlyArray<NodeAny>> = {
  [ChildrenID in TChildren[number][_NAMEType]]: TChildren[number] & {
    [_NAME]: ChildrenID;
  };
};

export type OnCloseResultIntents =
  | RunNodeIntent
  | StopPropagationIntent
  | ExitIntent;

export type OnExitResultIntents = ExitIntent;

export abstract class Node<
  TName extends string,
  TFP extends FiberPolicy,
  TSP extends NodeStatePolicy,
  TIn extends IOConstraint,
  TOut extends IOConstraint,
  TClose extends IOConstraint,
  TChildren extends ReadonlyArray<NodeAny> = [],
> extends WithIO<IO<TIn, TOut>> {
  /**
   * Creates a map of children nodes by their name.
   *
   * @param children - The list of children nodes.
   * @returns A map of children nodes by their name.
   */
  private static makeChildrenMap<TChildren extends ReadonlyArray<NodeAny>>(
    children: TChildren,
  ): NodeChildrenMap<TChildren> {
    return children.reduce((acc, child) => {
      acc[child[_NAME] as TChildren[number][_NAMEType]] = child;
      return acc;
    }, {} as NodeChildrenMap<TChildren>);
  }

  get type(): string {
    return this.constructor.name;
  }

  get id(): string {
    return [this.parentNode?.id, this[_NAME]].filter(Boolean).join('/');
  }

  get isRoot(): boolean {
    return this.parentNode === null;
  }

  readonly [_FP] = {} as TFP;
  readonly [_SP] = {} as TSP;
  readonly [_CLOSE] = {} as TClose;
  readonly [_NAME]: TName;

  readonly backpressurePolicy: BackpressurePolicy =
    nearestForkBackpressurePolicy();

  readonly childrenMap: NodeChildrenMap<TChildren>;
  readonly childrenArray: TChildren;

  protected get name(): TName {
    return this[_NAME];
  }

  protected parentNode: NodeAny | null = null;

  constructor(
    name: TName,
    children: TChildren,
    parentNode: NodeAny | null = null,
  ) {
    super();
    this[_NAME] = name;
    this.childrenMap = Node.makeChildrenMap(children);
    this.childrenArray = children;
    this.parentNode = parentNode;
    this.childrenArray.forEach(c => c.setParentNode(this));
  }

  abstract fiberPolicy: TFP;
  abstract statePolicy: TSP;

  setParentNode(parentNode: NodeAny) {
    this.parentNode = parentNode;
  }

  hasChildren(): this is NodeAny {
    return Object.keys(this.childrenMap).length > 0;
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

  getChild(name: inferNodeName<TChildren[number]>): NodeAny | undefined {
    return this.childrenMap[name];
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

  abstract onClose(
    context: inferNodeEventHandlerContext<this>,
  ): Promise<OnCloseResultIntents[]>;

  abstract onExit(
    context: inferNodeEventHandlerContext<this>,
  ): Promise<OnExitResultIntents[]>;
}

export abstract class PipeNode<
  TName extends string,
  TSP extends NodeStatePolicy,
  TIn extends IOConstraint,
  TOut extends IOConstraint,
  TClose extends IOConstraint,
  TChildren extends ReadonlyArray<NodeAny> = [],
> extends Node<TName, PipeFiberPolicy, TSP, TIn, TOut, TClose, TChildren> {}

// export abstract class StreamNode<
//   TName extends string,
//   TSP extends NodeStatePolicy,
//   TIn extends IOConstraint,
//   TOut extends IOConstraint,
//   TClose extends IOConstraint,
//   TChildren extends ReadonlyArray<NodeAny> = [],
// > extends PipeNode<TName, TSP, TIn, TOut, TClose, TChildren> {
//   abstract getFirst(): NodeAny | null;
//   abstract getPrevious(nodeId: string): NodeAny | null;
//   abstract getNext(nodeId: string): NodeAny | null;
// }

export abstract class ForkNode<
  TName extends string,
  TSP extends NodeStatePolicy,
  TIn extends IOConstraint,
  TOut extends IOConstraint,
  TClose extends IOConstraint,
  TChildren extends ReadonlyArray<NodeAny> = [],
> extends Node<TName, ForkFiberPolicy, TSP, TIn, TOut, TClose, TChildren> {}

export abstract class JoinNode<
  TName extends string,
  TSP extends NodeStatePolicy,
  TIn extends IOConstraint,
  TOut extends IOConstraint,
  TClose extends IOConstraint,
  TChildren extends ReadonlyArray<NodeAny> = [],
> extends Node<TName, JoinFiberPolicy, TSP, TIn, TOut, TClose, TChildren> {}

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

// export type StreamNodeAny = StreamNode<
//   string,
//   NodeStatePolicy,
//   IOConstraint,
//   IOConstraint,
//   any,
//   any
// >;

export type NodeAnyWithSpecificInput<TIn extends IOConstraint> = Node<
  string,
  FiberPolicy,
  NodeStatePolicy,
  TIn,
  IOConstraint,
  any,
  any
>;

export type inferNodeName<N extends NodeAny> = N[_NAMEType];
export type inferNodeFP<N extends NodeAny> = N[_FPType];
export type inferNodeSP<N extends NodeAny> = N[_SPType];
export type inferNodeClose<N extends NodeAny> = N[_CLOSEType];
export type inferNodeChildren<N extends NodeAny> = N['childrenArray'];

export type inferNodeRunContext<N extends NodeAny> = NodeRunContext<
  inferNodeFP<N>,
  inferNodeSP<N>,
  IOIn<GetIO<N>>
>;

export type inferNodeEventHandlerContext<N extends NodeAny> =
  NodeEventHandlerContext<inferNodeSP<N>, IOIn<GetIO<N>>>;

export type inferNodeRunReturn<N extends NodeAny> = Promise<
  (CloseFiberIntent<inferNodeClose<N>> | RunNodeIntent)[]
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

// nodeA.__checkIO({ foo: 'a' });

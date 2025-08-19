import type { CloseFiberIntent } from '../Intent';
import { type IO, type IOConstraint, WithIO } from '../helpers/IO';

import type {
  FiberPolicy,
  ForkFiberPolicy,
  JoinFiberPolicy,
  PipeFiberPolicy,
} from './FiberPolicy';
import type { ContextMap, NodeRunContext } from './NodeRunContext';
import type { NodeStatePolicy } from './NodeStatePolicy';

export abstract class Node<
  Tid extends string,
  Tfp extends FiberPolicy,
  Tsp extends NodeStatePolicy,
  Tin extends IOConstraint,
  Tout extends IOConstraint,
  Tclose extends IOConstraint = Tout,
> extends WithIO<IO<Tin, Tout>> {
  readonly id: Tid;
  readonly children: Record<string, NodeAny> = {};

  constructor(id: Tid) {
    super();
    this.id = id;
  }

  abstract fiberPolicy: Tfp;
  abstract statePolicy: Tsp;

  getDirectChild(id: string): NodeAny | undefined {
    return this.children[id];
  }

  runForTS(_input: Tin): Tout | Promise<Tout> {
    throw new Error('Method not implemented.');
  }

  abstract run(
    context: NodeRunContext<this>,
  ): Promise<CloseFiberIntent<Tclose>[]>;
}

export type NodeAnyWithForkPolicy = Node<
  string,
  ForkFiberPolicy,
  NodeStatePolicy,
  IOConstraint,
  IOConstraint,
  any
>;

export type NodeAnyWithJoinPolicy = Node<
  string,
  JoinFiberPolicy,
  NodeStatePolicy,
  IOConstraint,
  IOConstraint,
  any
>;

export type NodeAnyWithPipePolicy = Node<
  string,
  PipeFiberPolicy,
  NodeStatePolicy,
  IOConstraint,
  IOConstraint,
  any
>;

// // export type NodeAny = Node<
// //   string,
// //   FiberPolicy,
// //   NodeStatePolicy,
// //   IOConstraint,
// //   IOConstraint,
// //   IOConstraint
// // >;

export type NodeAny =
  | NodeAnyWithForkPolicy
  | NodeAnyWithJoinPolicy
  | NodeAnyWithPipePolicy;

export type inferNodeFP<N extends NodeAny> =
  N extends Node<any, infer FP, any, any, any, any> ? FP : never;

export type inferNodeSP<N extends NodeAny> =
  N extends Node<any, any, infer SP, any, any, any> ? SP : never;

export type inferNodeClose<N extends NodeAny> =
  N extends Node<any, any, any, any, any, infer Close> ? Close : never;

declare const node: NodeAny;

type T = ContextMap<NodeAny>;
type T2 = NodeRunContext<NodeAny>;

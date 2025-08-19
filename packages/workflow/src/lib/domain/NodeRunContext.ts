import type { GetIO, IOIn } from '../helpers/IO';
import type { DataStore } from '../stores/DataStore';
import type { FiberStore } from '../stores/FiberStore';

import type { Fiber } from './Fiber';
import type { FIBER_POLICY_TYPE } from './FiberPolicy';
import type {
  Node,
  NodeAny,
  NodeAnyWithForkPolicy,
  NodeAnyWithJoinPolicy,
  NodeAnyWithPipePolicy,
  inferNodeFP,
  inferNodeSP,
} from './Node';

export type NodeRunContextStores = {
  data: DataStore;
  fiber: FiberStore;
};

export abstract class NodeRunContextBase<N extends NodeAny> {
  statePolicy: inferNodeSP<N>;
  stores: NodeRunContextStores;

  constructor(stores: NodeRunContextStores, statePolicy: inferNodeSP<N>) {
    this.statePolicy = statePolicy;
    this.stores = stores;
  }

  async loadInputFiberData(fiber: Fiber): Promise<NonNullable<IOIn<GetIO<N>>>> {
    if (fiber.dataRef == null) {
      throw new Error('Input fiber has no data ref');
    }

    return this.stores.data.getData<IOIn<GetIO<N>>>(fiber.dataRef);
  }

  async *iterateFiberScopeMembers(
    fiber: Fiber,
    node: NodeAnyWithJoinPolicy | NodeAnyWithForkPolicy,
  ) {
    return yield* this.stores.fiber.iterateFiberScopeMembers(fiber, node);
  }
}

export class PipeNodeRunContext<
  N extends NodeAnyWithPipePolicy,
> extends NodeRunContextBase<N> {
  inputFiber: Fiber;
  runFiber: Fiber;

  constructor(
    stores: NodeRunContextStores,
    statePolicy: inferNodeSP<N>,
    inputFiber: Fiber,
    runFiber: Fiber,
  ) {
    super(stores, statePolicy);
    this.inputFiber = inputFiber;
    this.runFiber = runFiber;
  }
}

export class ForkNodeRunContext<
  N extends NodeAnyWithForkPolicy,
> extends NodeRunContextBase<N> {
  inputFiber: Fiber;
  runFibers: Fiber[];

  constructor(
    stores: NodeRunContextStores,
    statePolicy: inferNodeSP<N>,
    inputFiber: Fiber,
    runFibers: Fiber[],
  ) {
    super(stores, statePolicy);
    this.inputFiber = inputFiber;
    this.runFibers = runFibers;
  }
}

export class JoinNodeRunContext<
  N extends NodeAnyWithJoinPolicy,
> extends NodeRunContextBase<N> {
  runFiber: Fiber;

  constructor(
    stores: NodeRunContextStores,
    statePolicy: inferNodeSP<N>,
    runFiber: Fiber,
  ) {
    super(stores, statePolicy);
    this.runFiber = runFiber;
  }
}

export type ContextMap<N extends Node<any, any, any, any, any, any>> = {
  [FIBER_POLICY_TYPE.enum.PIPE]: PipeNodeRunContext<
    Extract<N, NodeAnyWithPipePolicy>
  >;
  [FIBER_POLICY_TYPE.enum.FORK]: ForkNodeRunContext<
    Extract<N, NodeAnyWithForkPolicy>
  >;
  [FIBER_POLICY_TYPE.enum.JOIN]: JoinNodeRunContext<
    Extract<N, NodeAnyWithJoinPolicy>
  >;
};

export type NodeRunContext<N extends Node<any, any, any, any, any, any>> =
  ContextMap<N>[inferNodeFP<N>['type']];

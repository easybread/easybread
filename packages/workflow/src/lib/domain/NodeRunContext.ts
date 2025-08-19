import type { IOConstraint } from '../helpers/IO';
import type { DataStore } from '../stores/DataStore';
import type { FiberStore } from '../stores/FiberStore';

import type { Fiber } from './Fiber';
import type { FIBER_POLICY_TYPE, FiberPolicy } from './FiberPolicy';
import type { NodeStatePolicy } from './NodeStatePolicy';

export type NodeRunContextStores = {
  data: DataStore;
  fiber: FiberStore;
};

export abstract class NodeRunContextBase<
  SP extends NodeStatePolicy,
  TIn extends IOConstraint,
> {
  statePolicy: SP;
  stores: NodeRunContextStores;

  constructor(stores: NodeRunContextStores, statePolicy: SP) {
    this.statePolicy = statePolicy;
    this.stores = stores;
  }

  async loadInputFiberData(fiber: Fiber): Promise<NonNullable<TIn>> {
    if (fiber.dataRef == null) {
      throw new Error('Input fiber has no data ref');
    }

    return this.stores.data.getData<TIn>(fiber.dataRef);
  }

  async *iterateFiberScopeMembers(
    fiber: Fiber,
    // node: JoinNodeAny | ForkNodeAny,
    node: any,
  ) {
    return yield* this.stores.fiber.iterateFiberScopeMembers(fiber, node);
  }
}

export class PipeNodeRunContext<
  SP extends NodeStatePolicy,
  TIn extends IOConstraint,
> extends NodeRunContextBase<SP, TIn> {
  readonly contextType = 'PIPE' as const;

  inputFiber: Fiber;
  runFiber: Fiber;

  constructor(
    stores: NodeRunContextStores,
    statePolicy: SP,
    inputFiber: Fiber,
    runFiber: Fiber,
  ) {
    super(stores, statePolicy);
    this.inputFiber = inputFiber;
    this.runFiber = runFiber;
  }
}

export class ForkNodeRunContext<
  SP extends NodeStatePolicy,
  TIn extends IOConstraint,
> extends NodeRunContextBase<SP, TIn> {
  readonly contextType = 'FORK' as const;

  inputFiber: Fiber;
  runFibers: Fiber[];

  constructor(
    stores: NodeRunContextStores,
    statePolicy: SP,
    inputFiber: Fiber,
    runFibers: Fiber[],
  ) {
    super(stores, statePolicy);
    this.inputFiber = inputFiber;
    this.runFibers = runFibers;
  }
}

export class JoinNodeRunContext<
  SP extends NodeStatePolicy,
  TIn extends IOConstraint,
> extends NodeRunContextBase<SP, TIn> {
  readonly contextType = 'JOIN' as const;

  runFiber: Fiber;

  constructor(stores: NodeRunContextStores, statePolicy: SP, runFiber: Fiber) {
    super(stores, statePolicy);
    this.runFiber = runFiber;
  }
}

export type ContextMap<SP extends NodeStatePolicy, TIn extends IOConstraint> = {
  [FIBER_POLICY_TYPE.enum.PIPE]: PipeNodeRunContext<SP, TIn>;
  [FIBER_POLICY_TYPE.enum.FORK]: ForkNodeRunContext<SP, TIn>;
  [FIBER_POLICY_TYPE.enum.JOIN]: JoinNodeRunContext<SP, TIn>;
};

export type NodeRunContext<
  FP extends FiberPolicy,
  SP extends NodeStatePolicy,
  TIn extends IOConstraint,
> = ContextMap<SP, TIn>[FP['type']];

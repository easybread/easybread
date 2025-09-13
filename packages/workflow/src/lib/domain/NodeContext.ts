import type { ServiceRegistry } from '../ServiceRegistry';
import type { IOConstraint } from '../helpers/IO';
import { DataStore } from '../stores/DataStore';
import { FiberStore } from '../stores/FiberStore';

import type { Fiber } from './Fiber';
import type { FIBER_POLICY_TYPE, FiberPolicy } from './FiberPolicy';
import type { ForkNodeAny, JoinNodeAny, NodeAny } from './Node';
import type { NodeStatePolicy } from './NodeStatePolicy';

export abstract class NodeContextBase<
  SP extends NodeStatePolicy,
  TIn extends IOConstraint,
> {
  statePolicy: SP;
  registry: ServiceRegistry;

  constructor(registry: ServiceRegistry, statePolicy: SP) {
    this.statePolicy = statePolicy;
    this.registry = registry;
  }

  async loadInputFiberData(fiber: Fiber): Promise<NonNullable<TIn>> {
    if (fiber.dataRef == null) {
      throw new Error('Input fiber has no data ref');
    }

    return this.registry.getInstance(DataStore).getData<TIn>(fiber.dataRef);
  }

  async *iterateFiberScopeMembers(
    fiber: Fiber,
    node: JoinNodeAny | ForkNodeAny,
    // node: any,
  ) {
    return yield* this.registry
      .getInstance(FiberStore)
      .fiberScopeMembersGenerator(fiber, node);
  }
}

export class PipeNodeRunContext<
  SP extends NodeStatePolicy,
  TIn extends IOConstraint,
> extends NodeContextBase<SP, TIn> {
  readonly contextType = 'PIPE' as const;

  inputFiber: Fiber;
  runFiber: Fiber;

  constructor(
    serviceRegistry: ServiceRegistry,
    statePolicy: SP,
    inputFiber: Fiber,
    runFiber: Fiber,
  ) {
    super(serviceRegistry, statePolicy);
    this.inputFiber = inputFiber;
    this.runFiber = runFiber;
  }
}

export class ForkNodeRunContext<
  SP extends NodeStatePolicy,
  TIn extends IOConstraint,
> extends NodeContextBase<SP, TIn> {
  readonly contextType = 'FORK' as const;

  inputFiber: Fiber;
  runFibers: Fiber[];

  constructor(
    registry: ServiceRegistry,
    statePolicy: SP,
    inputFiber: Fiber,
    runFibers: Fiber[],
  ) {
    super(registry, statePolicy);
    this.inputFiber = inputFiber;
    this.runFibers = runFibers;
  }
}

export class JoinNodeRunContext<
  SP extends NodeStatePolicy,
  TIn extends IOConstraint,
> extends NodeContextBase<SP, TIn> {
  readonly contextType = 'JOIN' as const;

  runFiber: Fiber;

  constructor(registry: ServiceRegistry, statePolicy: SP, runFiber: Fiber) {
    super(registry, statePolicy);
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

export class NodeEventHandlerContext<
  SP extends NodeStatePolicy,
  TIn extends IOConstraint,
> extends NodeContextBase<SP, TIn> {
  readonly contextType = 'EVENT_HANDLER' as const;

  eventFiber: Fiber;

  constructor(registry: ServiceRegistry, statePolicy: SP, eventFiber: Fiber) {
    super(registry, statePolicy);
    this.eventFiber = eventFiber;
  }

  async resolveRunFiber(node: NodeAny, fiber: Fiber) {
    const key = fiber.keyPrefixByLastMatchingNodeId(id => id === node.id);

    return await this.registry
      .getInstance(FiberStore)
      .getFiber(fiber.execId, key);
  }

  async resolveInputFiber(node: NodeAny, fiber: Fiber) {
    const key = fiber.keyOfInputFiber(node.id);

    return await this.registry
      .getInstance(FiberStore)
      .getFiber(fiber.execId, key);
  }
}

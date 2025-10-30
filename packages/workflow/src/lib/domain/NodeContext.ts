import type { ServiceRegistry } from '../ServiceRegistry';
import type { IOConstraint } from '../helpers/IO';
import { DataStore } from '../stores/DataStore';
import { EventStore } from '../stores/EventStore';
import { FiberStore } from '../stores/FiberStore';

import type { Fiber } from './Fiber';
import type { ForkNodeAny, JoinNodeAny, NodeAny } from './Node';
import type { NodeStatePolicy } from './NodeStatePolicy';
import { WORKFLOW_EVENT_NAME } from './WorkflowEvent';
import { EventKeyPattern } from './keyPatterns/EventKeyPattern';

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
  ) {
    return yield* this.registry
      .getInstance(FiberStore)
      .fiberScopeMembersGenerator(fiber, node);
  }
}

export class NodeRunContext<
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

  async resolveRunFiber(node: NodeAny) {
    return await this.registry
      .getInstance(FiberStore)
      .resolveNearestRunFiber(this.eventFiber, node);
  }

  async resolveInputFiber(node: NodeAny) {
    return await this.registry
      .getInstance(FiberStore)
      .resolveNearestInputFiber(this.eventFiber, node);
  }

  async countPendingChildrenTasks(node: NodeAny) {
    const runFiber = await this.resolveRunFiber(node);
    const eventStore = this.registry.getInstance(EventStore);

    return await eventStore.countEvents(
      EventKeyPattern.make({
        eventName: WORKFLOW_EVENT_NAME.enum.NODE_SCHEDULED,
        execId: this.eventFiber.execId,
        nodeId: EventKeyPattern.makePathSegment([
          node.id,
          EventKeyPattern.WILDCARDS.ONE_SEGMENT,
        ]),
        fiberKey: EventKeyPattern.makePathSegment([
          runFiber.key.toString(),
          EventKeyPattern.WILDCARDS.MULTIPLE_SEGMENTS,
        ]),
      }),
    );
  }
}
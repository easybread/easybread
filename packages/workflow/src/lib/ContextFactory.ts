import type { ServiceRegistry } from './ServiceRegistry';
import type { Fiber } from './domain/Fiber';
import type { NodeAny } from './domain/Node';
import { NodeEventHandlerContext, NodeRunContext } from './domain/NodeContext';

export class ContextFactory {
  private readonly serviceRegistry: ServiceRegistry;

  constructor(serviceRegistry: ServiceRegistry) {
    this.serviceRegistry = serviceRegistry;
  }

  async createNodeRunContext({
    node,
    inputFiber,
    runFiber,
  }: {
    node: NodeAny;
    inputFiber: Fiber;
    runFiber: Fiber;
  }) {
    return new NodeRunContext(
      this.serviceRegistry,
      node.statePolicy,
      inputFiber,
      runFiber,
    );
  }

  async createNodeEventHandlerContext({
    node,
    eventFiber,
  }: {
    node: NodeAny;
    eventFiber: Fiber;
  }) {
    return new NodeEventHandlerContext(
      this.serviceRegistry,
      node.statePolicy,
      eventFiber,
    );
  }
}

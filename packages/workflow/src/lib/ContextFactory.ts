import type { ServiceRegistry } from './ServiceRegistry';
import type { Fiber } from './domain/Fiber';
import { FIBER_POLICY_TYPE } from './domain/FiberPolicy';
import type {
  ForkNodeAny,
  JoinNodeAny,
  NodeAny,
  PipeNodeAny,
} from './domain/Node';
import {
  ForkNodeRunContext,
  JoinNodeRunContext,
  PipeNodeRunContext,
} from './domain/NodeRunContext';
import { FiberStore } from './stores/FiberStore';

export class ContextFactory {
  private readonly serviceRegistry: ServiceRegistry;

  private get fiberStore() {
    return this.serviceRegistry.getInstance(FiberStore);
  }

  constructor(serviceRegistry: ServiceRegistry) {
    this.serviceRegistry = serviceRegistry;
  }

  async createNodeRunContext(node: NodeAny, inputFiber: Fiber) {
    switch (node.fiberPolicy.type) {
      case FIBER_POLICY_TYPE.enum.PIPE:
        return this.createPipeNodeRunContext(node as PipeNodeAny, inputFiber);
      case FIBER_POLICY_TYPE.enum.FORK:
        return this.createForkNodeRunContext(node as ForkNodeAny, inputFiber);
      case FIBER_POLICY_TYPE.enum.JOIN:
        return this.createJoinNodeRunContext(node as JoinNodeAny, inputFiber);
    }
  }

  async createPipeNodeRunContext(node: PipeNodeAny, inputFiber: Fiber) {
    const runFiber = await this.fiberStore.openPipeFiber(inputFiber, node);

    return new PipeNodeRunContext(
      this.serviceRegistry,
      node.statePolicy,
      inputFiber,
      runFiber,
    );
  }

  async createForkNodeRunContext(node: ForkNodeAny, inputFiber: Fiber) {
    const runFibers = await this.fiberStore.openForkFibers(inputFiber, node);

    return new ForkNodeRunContext(
      this.serviceRegistry,
      node.statePolicy,
      inputFiber,
      runFibers,
    );
  }

  async createJoinNodeRunContext(node: JoinNodeAny, inputFiber: Fiber) {
    const runFiber = await this.fiberStore.openJoinFiber(inputFiber, node);

    return new JoinNodeRunContext(
      this.serviceRegistry,
      node.statePolicy,
      runFiber,
    );
  }
}

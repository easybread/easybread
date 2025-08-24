import type { WorkflowRuntimeStores } from './WorkflowRuntimeStores';
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

export class ContextFactory {
  constructor(private readonly stores: WorkflowRuntimeStores) {}

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
    const runFiber = await this.stores.fiber.openPipeFiber(inputFiber, node);
    return new PipeNodeRunContext(
      this.stores,
      node.statePolicy,
      inputFiber,
      runFiber,
    );
  }

  async createForkNodeRunContext(node: ForkNodeAny, inputFiber: Fiber) {
    const runFibers = await this.stores.fiber.openForkFibers(inputFiber, node);
    return new ForkNodeRunContext(
      this.stores,
      node.statePolicy,
      inputFiber,
      runFibers,
    );
  }

  async createJoinNodeRunContext(node: JoinNodeAny, inputFiber: Fiber) {
    const runFiber = await this.stores.fiber.openJoinFiber(inputFiber, node);
    return new JoinNodeRunContext(this.stores, node.statePolicy, runFiber);
  }
}

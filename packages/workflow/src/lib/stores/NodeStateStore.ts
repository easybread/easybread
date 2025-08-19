import { WorkflowStore } from '../WorkflowStore';
import type { WorkflowStoreAdapter } from '../WorkflowStoreAdapter';
import type { FiberAny } from '../domain/Fiber';
import type { NodeAny } from '../domain/Node';

export class NodeStateStore extends WorkflowStore {
  constructor(adapter: WorkflowStoreAdapter) {
    super('NODE_STATE', adapter);
  }

  async getNodeState(inputFiber: FiberAny, node: NodeAny) {
    // depdnding on the policy, resolve the 
  }
}

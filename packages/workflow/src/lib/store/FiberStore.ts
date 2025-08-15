import { UnknownFiberPolicyError } from '../Error';
import type { WorkflowNode, WorkflowNodeAny } from '../WorkflowNode';

import { Fiber, FiberAny, FiberJSONAny } from './Fiber';
import {
  FIBER_POLICY_TYPE,
  type FiberForkPolicy,
  type FiberJoinPolicy,
  type PipePolicy,
  type WorkflowForkPolicy,
} from './FiberPolicy';
import { FiberScopePrefixStore, FiberScopeStore } from './FiberScopeStore';
import { WorkflowStore } from './WorkflowStore';
import type { WorkflowStoreAdapter } from './WorkflowStoreAdapter';

export class FiberStore extends WorkflowStore {
  private readonly fiberScopeStore: FiberScopeStore;
  private readonly fiberScopePrefixStore: FiberScopePrefixStore;

  constructor(adapter: WorkflowStoreAdapter) {
    super('FIBER', adapter);
    this.fiberScopeStore = new FiberScopeStore(adapter);
    this.fiberScopePrefixStore = new FiberScopePrefixStore(adapter);
  }

  async getFiber(execId: string, fiberKey: string) {
    const storeKey = this.encodeStoreKey(
      Fiber.pkEncode({ execId, key: fiberKey }),
    );

    const fiberJSON = await this.adapter.get<FiberJSONAny>(storeKey);

    if (!fiberJSON) {
      throw new Error(`Fiber not found: ${storeKey}`);
    }

    return Fiber.fromJSON(fiberJSON);
  }

  /**
   * @param baseFiber - the fiber to create a new fiber from
   * @param nodeId - the nodeId of the node that is creating the new fiber
   * @param policy - the policy of the new fiber
   * @returns the new fiber
   */
  async openFibers(baseFiber: FiberAny, node: WorkflowNodeAny) {
    switch (node.fiberPolicy.type) {
      case FIBER_POLICY_TYPE.enum.WORKFLOW_FORK:
        return this.openWorkflowForkFiber(baseFiber, node);

      case FIBER_POLICY_TYPE.enum.FIBER_FORK:
        return this.openFiberForkFiber(baseFiber, node);

      case FIBER_POLICY_TYPE.enum.FIBER_JOIN:
        return this.openFiberJoinFiber(baseFiber, node);

      case FIBER_POLICY_TYPE.enum.PIPE:
        return this.openPipeFiber(baseFiber, node);

      default:
        throw new UnknownFiberPolicyError(node.fiberPolicy satisfies never);
    }
  }

  openWorkflowForkFiber(
    _baseFiber: FiberAny,
    _node: WorkflowNode<any, WorkflowForkPolicy, any>,
  ) {
    throw new Error('Method not implemented.');
  }

  async openFiberForkFiber(
    baseFiber: FiberAny,
    node: WorkflowNode<any, FiberForkPolicy, any>,
  ) {
    const [scopePrefix] = await this.fiberScopePrefixStore.acquireMemberSlots({
      execId: baseFiber.execId,
      nodeId: node.id,
      key: baseFiber.scopePrefixKey(node.id, node.fiberPolicy.type),
      fiberPolicy: node.fiberPolicy,
      memberCount: 1,
    });

    const fiber = baseFiber.fork(node.id, scopePrefix.ordinality);

    await this.fiberScopeStore.appendMembers({
      execId: baseFiber.execId,
      nodeId: node.id,
      key: baseFiber.scopeKey(node.id, node.fiberPolicy.type),
      members: [fiber.key.toString()],
      fiberPolicy: node.fiberPolicy,
    });

    await this.saveFiber(fiber);

    return fiber;
  }

  openFiberJoinFiber(
    _baseFiber: FiberAny,
    _node: WorkflowNode<any, FiberJoinPolicy, any>,
  ) {
    throw new Error('Method not implemented.');
  }

  async openPipeFiber(
    baseFiber: FiberAny,
    node: WorkflowNode<any, PipePolicy, any>,
  ) {
    // TODO: should we check if the fiber already exists?
    const fiber = baseFiber.pipe(node.id);
    await this.saveFiber(fiber);

    return fiber;
  }

  async saveFiber(fiber: FiberAny) {
    const storeKey = this.encodeStoreKey(
      Fiber.pkEncode({ execId: fiber.execId, key: fiber.key.toString() }),
    );

    await this.adapter.set(storeKey, fiber.toJSON());
  }
}

import { WorkflowStore } from '../WorkflowStore';
import type { WorkflowStoreAdapter } from '../WorkflowStoreAdapter';
import { Fiber, FiberJSONAny } from '../domain/Fiber';
import { FIBER_POLICY_TYPE } from '../domain/FiberPolicy';
import type { ForkNodeAny, JoinNodeAny, PipeNodeAny } from '../domain/Node';

import { FiberScopePrefixStore } from './FiberScopePrefixStore';
import { FiberScopeStore } from './FiberScopeStore';

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

  async getFiberScope(fiber: Fiber, node: JoinNodeAny | ForkNodeAny) {
    const fiberPolicy = node.fiberPolicy;
    const scopeKey =
      fiberPolicy.type === FIBER_POLICY_TYPE.enum.FORK
        ? fiber.scopeKey(fiber.nodeId, fiberPolicy)
        : fiber.scopeKey(fiberPolicy.anchor, fiberPolicy, fiber.ordinality);

    return await this.fiberScopeStore.getScope({
      execId: fiber.execId,
      nodeId: fiber.nodeId,
      key: scopeKey,
    });
  }

  async getFiberScopeMembers(fiber: Fiber, node: JoinNodeAny | ForkNodeAny) {
    const scope = await this.getFiberScope(fiber, node);

    return await Promise.all(
      scope.members.map(m => this.getFiber(fiber.execId, m)),
    );
  }

  async *iterateFiberScopeMembers(
    fiber: Fiber,
    node: JoinNodeAny | ForkNodeAny,
  ) {
    const scope = await this.getFiberScope(fiber, node);
    for (const member of scope.members) {
      yield await this.getFiber(fiber.execId, member);
    }
  }

  async openForkFibers(inputFiber: Fiber, node: ForkNodeAny) {
    // create prefix snapshots for each fork to preserve ordinality.
    const prefixes = await this.fiberScopePrefixStore.acquireMemberSlots({
      execId: inputFiber.execId,
      nodeId: node.id,
      key: inputFiber.scopePrefixKey(node.id, node.fiberPolicy),
      fiberPolicy: node.fiberPolicy,
      memberCount: node.fiberPolicy.forkCount ?? 1,
    });

    // fork a new fiber for each prefix using the preserved ordinality
    const fibers = prefixes.map(p => inputFiber.fork(node.id, p.ordinality));
    await Promise.all(fibers.map(f => this.saveFiber(f)));

    // append fibers to the scope to keep track of forked fibers
    await this.fiberScopeStore.appendMembers({
      execId: inputFiber.execId,
      nodeId: node.id,
      key: inputFiber.scopeKey(node.id, node.fiberPolicy),
      members: fibers.map(f => f.key.toString()),
      fiberPolicy: node.fiberPolicy,
    });

    return fibers;
  }

  async openJoinFiber(inputFiber: Fiber, node: JoinNodeAny) {
    // create one scope prefix snapshot to calculate and preserve ordinality upfront.
    const [prefix] = await this.fiberScopePrefixStore.acquireMemberSlots({
      execId: inputFiber.execId,
      nodeId: node.id,
      key: inputFiber.scopePrefixKey(node.fiberPolicy.anchor, node.fiberPolicy),
      fiberPolicy: node.fiberPolicy,
      memberCount: 1,
    });

    // append the INPUT fiber to the scope to keep track of joined fibers
    await this.fiberScopeStore.appendMembers({
      execId: inputFiber.execId,
      nodeId: node.id,
      key: inputFiber.scopeKey(
        node.fiberPolicy.anchor,
        node.fiberPolicy,
        prefix.ordinality,
      ),
      members: [inputFiber.key.toString()],
      fiberPolicy: node.fiberPolicy,
    });

    // create a new join fiber from the input fiber
    // This allows to keep track of which input fiber triggered this particular fiber.
    const fiber = inputFiber.join(node.id, prefix.ordinality);
    await this.saveFiber(fiber);

    return fiber;
  }

  async openPipeFiber(inputFiber: Fiber, node: PipeNodeAny) {
    const fiber = inputFiber.pipe(node.id);
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

import { WorkflowStore } from '../WorkflowStore';
import type { WorkflowStoreAdapter } from '../WorkflowStoreAdapter';
import type { FiberPolicy } from '../domain/FiberPolicy';
import { FiberScope, FiberScopeJSON } from '../domain/FiberScope';

export class FiberScopeStore extends WorkflowStore {
  constructor(adapter: WorkflowStoreAdapter) {
    super('FIBER_SCOPE', adapter);
  }

  async getScope(options: { execId: string; nodeId: string; key: string }) {
    const { execId, nodeId, key } = options;

    const storeKey = this.encodeStoreKey(
      FiberScope.pkEncode({ execId, nodeId, key }),
    );

    const fiberScopeJSON = await this.adapter.get<FiberScopeJSON>(storeKey);

    if (!fiberScopeJSON) {
      // TODO: custom error for this!
      throw new Error(`Fiber scope not found: ${storeKey}`);
    }

    return FiberScope.fromJSON(fiberScopeJSON);
  }

  async appendMembers(options: {
    execId: string;
    nodeId: string;
    key: string;
    members: string[];
    fiberPolicy: FiberPolicy;
  }) {
    const { execId, nodeId, key, members } = options;

    const storeKey = this.encodeStoreKey(
      FiberScope.pkEncode({ execId, nodeId, key }),
    );

    return await this.adapter
      .cas<FiberScopeJSON>(storeKey, async json => {
        const scope = json
          ? FiberScope.fromJSON(json)
          : FiberScope.createEmpty(options);

        for (const member of members) {
          scope.appendMember(member);
        }

        return scope.toJSON();
      })
      .then(json => FiberScope.fromJSON(json));
  }
}

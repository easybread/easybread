import { CASVersionMismatchError } from '../Error';

import type { FiberPolicy } from './FiberPolicy';
import { FiberScope, type FiberScopeJSON } from './FiberScope';
import { WorkflowStore } from './WorkflowStore';
import type { WorkflowStoreAdapter } from './WorkflowStoreAdapter';

export class FiberScopeStore extends WorkflowStore {
  constructor(adapter: WorkflowStoreAdapter) {
    super('FIBER_SCOPE', adapter);
  }

  async appendMembers(options: {
    execId: string;
    nodeId: string;
    key: string;
    members: string[];
    fiberPolicy: FiberPolicy;
  }) {
    const { execId, nodeId, key, members, fiberPolicy } = options;

    const storeKey = this.encodeStoreKey(
      FiberScope.pkEncode({ execId, nodeId, key }),
    );

    let scope: FiberScope;

    const json = await this.adapter.get<FiberScopeJSON>(storeKey);

    if (json) {
      scope = FiberScope.fromJSON(json);
    } else {
      scope = FiberScope.createEmpty({ execId, nodeId, key, fiberPolicy });
    }

    for (const member of members) {
      scope.appendMember(member);
    }

    await this.adapter.cas(storeKey, scope.toJSON()).catch(e => {
      if (e instanceof CASVersionMismatchError) {
        return this.appendMembers(options);
      }
      throw e;
    });

    return scope;
  }
}

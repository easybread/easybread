import { WorkflowStore } from '../WorkflowStore';
import type { WorkflowStoreAdapter } from '../WorkflowStoreAdapter';
import type { FiberPolicy } from '../domain/FiberPolicy';
import {
  FiberScopePrefix,
  type FiberScopePrefixJSON,
} from '../domain/FiberScopePrefix';

export interface BookMemberSlotsOptions {
  execId: string;
  nodeId: string;
  key: string;
  fiberPolicy: FiberPolicy;
  memberCount: number;
}

export function* range(start: number, end: number) {
  let i = start;
  while (i < end) {
    yield i++;
  }
}

export class FiberScopePrefixStore extends WorkflowStore {
  constructor(adapter: WorkflowStoreAdapter) {
    super('FIBER_SCOPE_PREFIX', adapter);
  }

  async acquireMemberSlots(options: BookMemberSlotsOptions) {
    const { execId, nodeId, key, memberCount } = options;

    const storeKey = this.encodeStoreKey(
      // S(execId):P(nodeId):P(key)
      FiberScopePrefix.pkEncode({ execId, nodeId, key }),
    );

    return await this.rwLock.usingWriteLock(storeKey, async () => {
      const json = await this.adapter.get<FiberScopePrefixJSON>(storeKey);
      const resultPrefixes: FiberScopePrefix[] = [];

      let prefix = json
        ? FiberScopePrefix.fromJSON(json)
        : FiberScopePrefix.createEmpty(options);

      // create scope prefix snapshot for each member
      for (const _ of range(0, memberCount)) {
        prefix = prefix.toIncrementedSize(options.fiberPolicy);
        resultPrefixes.push(prefix);
      }

      await this.adapter.set(storeKey, prefix.toJSON());

      return resultPrefixes;
    });
  }
}

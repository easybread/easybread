import type { FiberPolicy } from './FiberPolicy';
import {
  FiberScopePrefix,
  type FiberScopePrefixJSON,
} from './FiberScopePrefix';
import { WorkflowStore } from './WorkflowStore';
import type { WorkflowStoreAdapter } from './WorkflowStoreAdapter';

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
      FiberScopePrefix.pkEncode({ execId, nodeId, key }),
    );

    let resultPrefixes: FiberScopePrefix[] = [];

    // write the last state
    await this.adapter.cas<FiberScopePrefixJSON>(storeKey, async json => {
      resultPrefixes = [];

      let prefix = json
        ? FiberScopePrefix.fromJSON(json)
        : FiberScopePrefix.createEmpty(options);

      // create scope prefix snapshot for each member
      for (const _ of range(0, memberCount)) {
        prefix = prefix.toIncrementedSize(options.fiberPolicy);
        resultPrefixes.push(prefix);
      }

      return prefix.toJSON();
    });

    return resultPrefixes;
  }
}

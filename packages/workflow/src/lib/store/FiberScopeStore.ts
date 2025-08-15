import { VersionMismatchError } from '../Error';

import type { FiberPolicy } from './FiberPolicy';
import {
  FiberScope,
  type FiberScopeJSON,
  FiberScopePrefix,
  type FiberScopePrefixJSON,
} from './FiberScope';
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
      if (e instanceof VersionMismatchError) {
        return this.appendMembers(options);
      }
      throw e;
    });

    return scope;
  }
}

interface BookMemberSlotsOptions {
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

    let prefix: FiberScopePrefix;

    const json = await this.adapter.get<FiberScopePrefixJSON>(storeKey);

    if (json) {
      prefix = FiberScopePrefix.fromJSON(json);
    } else {
      prefix = FiberScopePrefix.createEmpty(options);
    }

    const resultPrefixes: FiberScopePrefix[] = [];

    // create scope prefix snapshot for each member
    for (const _ of range(0, memberCount)) {
      prefix = prefix.toIncrementedSize(options.fiberPolicy);
      resultPrefixes.push(prefix);
    }

    // write the last state
    await this.adapter.cas(storeKey, prefix.toJSON()).catch(e => {
      if (e instanceof VersionMismatchError) {
        return this.acquireMemberSlots(options);
      }
      throw e;
    });

    return resultPrefixes;
  }
}

import { enumSuiteObject } from '@space-architects/util-enum';

import { enumPickKeys } from '@easybread/common';

import { FIBER_POLICY_TYPE, type FiberPolicy } from './FiberPolicy';

export const FIBER_SCOPE_TYPE = enumSuiteObject(
  enumPickKeys(FIBER_POLICY_TYPE.enum, ['FORK', 'JOIN']),
);

export type FiberScopeType = typeof FIBER_SCOPE_TYPE.$type;

export type FiberScopeJSON = {
  execId: string;
  nodeId: string;
  key: string;
  members: string[];
  type: FiberScopeType;
};

interface CreateEmptyFiberScopeOptions {
  execId: string;
  nodeId: string;
  key: string;
  fiberPolicy: FiberPolicy;
}

/**
 * Represents the current state of the specific scope.
 * Primarily tracking the members of the scope.
 *
 * @example
 * ```text
 * FiberScope Store
 * node          key            members    type
 * r/batch       -/0/* /0       [...]      join
 * r/batch       -/0/* /1       [...]      join
 * r/batch       -/1/* /0       [...]      join
 * ...
 * r/batch       -/n/* /m       [...]      join
 * ...
 * r/paginate    -/*            [...]      fork
 * r/concurrent  -/*            [...]      fork
 * ```
 */
export class FiberScope {
  static pkEncode({
    execId,
    nodeId,
    key,
  }: Pick<FiberScope, 'execId' | 'nodeId' | 'key'>) {
    return `${execId}:${nodeId}:${key}`;
  }

  static pkDecode(pk: string) {
    const [execId, nodeId, key] = pk.split(':');
    return { execId, nodeId, key };
  }
  static fromJSON(json: FiberScopeJSON) {
    return new FiberScope(json);
  }

  static createEmpty({
    execId,
    nodeId,
    key,
    fiberPolicy,
  }: CreateEmptyFiberScopeOptions) {
    // TODO: revisit this approach.
    if (!FIBER_SCOPE_TYPE.hasValue(fiberPolicy.type)) {
      throw new Error('Invalid fiber policy for creating the ScopePrefix');
    }

    return new FiberScope({
      execId,
      nodeId,
      key,
      members: [],
      type: fiberPolicy.type,
    });
  }

  execId: string;
  nodeId: string;
  key: string;
  members: string[];
  type: FiberScopeType;

  constructor(props: FiberScopeJSON) {
    this.execId = props.execId;
    this.nodeId = props.nodeId;
    this.key = props.key;
    this.members = props.members;
    this.type = props.type;
  }

  appendMember(member: string) {
    this.members.push(member);
  }

  toJSON(): FiberScopeJSON {
    return {
      execId: this.execId,
      nodeId: this.nodeId,
      key: this.key,
      members: this.members,
      type: this.type,
    };
  }
}

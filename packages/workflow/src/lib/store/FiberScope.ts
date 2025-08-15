import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

import { FIBER_POLICY_TYPE, type FiberPolicy } from './FiberPolicy';

export const FIBER_SCOPE_TYPE = enumSuiteObject(enumObject(['JOIN', 'FORK']));
export type FiberScopeType = typeof FIBER_SCOPE_TYPE.$type;

export type FiberScopeJSON = {
  execId: string;
  nodeId: string;
  key: string;
  members: string[];
  type: FiberScopeType;
  version: number;
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
    switch (fiberPolicy.type) {
      case FIBER_POLICY_TYPE.enum.FIBER_FORK:
      case FIBER_POLICY_TYPE.enum.WORKFLOW_FORK:
        return this.createEmptyForkScope(execId, nodeId, key);

      case FIBER_POLICY_TYPE.enum.FIBER_JOIN:
        return this.createEmptyJoinScope(execId, nodeId, key);

      default:
        // TODO: custom error for this!
        throw new Error('Invalid fiber policy for creating the ScopePrefix');
    }
  }

  private static createEmptyForkScope(
    execId: string,
    nodeId: string,
    key: string,
  ) {
    return new FiberScope({
      execId,
      nodeId,
      key,
      members: [],
      type: FIBER_SCOPE_TYPE.enum.FORK,
      version: 0,
    });
  }

  private static createEmptyJoinScope(
    execId: string,
    nodeId: string,
    key: string,
  ) {
    return new FiberScope({
      execId,
      nodeId,
      key,
      members: [],
      type: FIBER_SCOPE_TYPE.enum.JOIN,
      version: 0,
    });
  }

  execId: string;
  nodeId: string;
  key: string;
  members: string[];
  type: FiberScopeType;
  version: number;

  constructor(props: FiberScopeJSON) {
    this.execId = props.execId;
    this.nodeId = props.nodeId;
    this.key = props.key;
    this.members = props.members;
    this.type = props.type;
    this.version = props.version;
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
      version: this.version,
    };
  }
}

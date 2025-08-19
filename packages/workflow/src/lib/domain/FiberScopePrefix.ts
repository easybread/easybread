import {
  FIBER_POLICY_TYPE,
  type FiberPolicy,
  type ForkFiberPolicy,
  type JoinFiberPolicy,
} from './FiberPolicy';
import { FIBER_SCOPE_TYPE, type FiberScopeType } from './FiberScope';

export type FiberScopePrefixJSON = {
  type: FiberScopeType;
  execId: string;
  nodeId: string;
  key: string;
  ordinality: number;
  size: number;
  version: number;
};

export interface CreateEmptyFiberScopePrefixOptions {
  execId: string;
  nodeId: string;
  key: string;
  fiberPolicy: FiberPolicy;
}

/**
 * Represents the current state of the scope prefix.
 *
 * @example
 * ```text
 * nodeId   key      ordinality size type   version
 * r/batch  -/0/*    1          2    join   2
 * r/batch  -/1/*    5          3    join   6
 * r/c      -/*      1          0    fork   2
 * ```
 */
export class FiberScopePrefix {
  static pkEncode({
    execId,
    nodeId,
    key,
  }: Pick<FiberScopePrefix, 'execId' | 'nodeId' | 'key'>) {
    return `${execId}:${nodeId}:${key}`;
  }

  static pkDecode(pk: string) {
    const [execId, nodeId, key] = pk.split(':');
    return { execId, nodeId, key };
  }

  static fromJSON(json: FiberScopePrefixJSON) {
    return new FiberScopePrefix(json);
  }

  static toIncrementedSize(
    scopePrefix: FiberScopePrefix,
    policy: FiberPolicy,
  ): FiberScopePrefix {
    switch (policy.type) {
      case FIBER_POLICY_TYPE.enum.JOIN:
        return this.toIncrementedSizeJoinScopePrefix(scopePrefix, policy);
      case FIBER_POLICY_TYPE.enum.FORK:
        return this.toIncrementedSizeForkScopePrefix(scopePrefix, policy);

      default:
        throw new Error('Invalid fiber policy for creating the ScopePrefix');
    }
  }

  private static toIncrementedSizeForkScopePrefix(
    scopePrefix: FiberScopePrefix,
    _policy: ForkFiberPolicy,
  ): FiberScopePrefix {
    return new FiberScopePrefix({
      ...scopePrefix,
      ordinality: scopePrefix.ordinality + 1,
      size: scopePrefix.size + 1,
    });
  }

  private static toIncrementedSizeJoinScopePrefix(
    scopePrefix: FiberScopePrefix,
    policy: JoinFiberPolicy,
  ): FiberScopePrefix {
    if (scopePrefix.size === policy.limit) {
      return new FiberScopePrefix({
        ...scopePrefix,
        ordinality: scopePrefix.ordinality + 1,
        size: 0,
      });
    }

    return new FiberScopePrefix({
      ...scopePrefix,
      size: scopePrefix.size + 1,
    });
  }

  static createEmpty({
    execId,
    nodeId,
    key,
    fiberPolicy,
  }: CreateEmptyFiberScopePrefixOptions) {
    switch (fiberPolicy.type) {
      case FIBER_POLICY_TYPE.enum.FORK:
        return this.createEmptyForkScopePrefix(execId, nodeId, key);

      case FIBER_POLICY_TYPE.enum.JOIN:
        return this.createEmptyJoinScopePrefix(execId, nodeId, key);

      default:
        // TODO: custom error for this!
        throw new Error('Invalid fiber policy for creating the ScopePrefix');
    }
  }

  private static createEmptyForkScopePrefix(
    execId: string,
    nodeId: string,
    key: string,
  ) {
    return new FiberScopePrefix({
      type: FIBER_SCOPE_TYPE.enum.FORK,
      execId,
      nodeId,
      key,
      ordinality: -1,
      size: 0,
      version: 0,
    });
  }

  private static createEmptyJoinScopePrefix(
    execId: string,
    nodeId: string,
    key: string,
  ) {
    return new FiberScopePrefix({
      type: FIBER_SCOPE_TYPE.enum.JOIN,
      execId,
      nodeId,
      key,
      ordinality: -1,
      size: 0,
      version: 0,
    });
  }

  type: FiberScopeType;
  execId: string;
  nodeId: string;
  key: string;
  ordinality: number;
  size: number;
  version: number;

  constructor(props: FiberScopePrefixJSON) {
    this.type = props.type;
    this.execId = props.execId;
    this.nodeId = props.nodeId;
    this.key = props.key;
    this.ordinality = props.ordinality;
    this.size = props.size;
    this.version = props.version;
  }

  /**
   * Creates a new FiberScopePrefix with the size incremented by 1.
   * Policy might instruct it to reset the size and increment the ordinality.
   *
   * @param policy - The policy to use to increment the size of the scope prefix.
   * @returns The new FiberScopePrefix.
   */
  toIncrementedSize(policy: FiberPolicy): FiberScopePrefix {
    return FiberScopePrefix.toIncrementedSize(this, policy);
  }

  toJSON(): FiberScopePrefixJSON {
    return {
      type: this.type,
      execId: this.execId,
      nodeId: this.nodeId,
      key: this.key,
      ordinality: this.ordinality,
      size: this.size,
      version: this.version,
    };
  }
}

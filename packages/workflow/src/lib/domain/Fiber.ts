import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

import {
  FiberAlreadyClosedError,
  FiberNotClosedError,
  InvalidFiberKeyError,
} from '../Error';

import { FiberKey } from './FiberKey';
import {
  FIBER_POLICY_TYPE,
  type FiberPolicy,
  type ForkFiberPolicy,
  type JoinFiberPolicy,
} from './FiberPolicy';
import { FIBER_SCOPE_TYPE } from './FiberScope';

export const FIBER_STATUS = enumSuiteObject(enumObject(['OPEN', 'CLOSED']));

export type FiberJSON = {
  execId: string;
  key: string;
  segments: string[];
  dataRef: string | null;
  status: typeof FIBER_STATUS.$type;
  policyType: typeof FIBER_POLICY_TYPE.$type;
};

export type FiberJSONAny = FiberJSON;

export class Fiber {
  static fromJSON(json: FiberJSON): Fiber {
    return new Fiber(json);
  }

  static pkEncode(options: Pick<FiberJSON, 'execId' | 'key'>) {
    return `${options.execId}:${options.key}`;
  }

  static pkDecode(pk: string) {
    const [execId, key] = pk.split(':');
    if (!execId || !key) {
      throw new InvalidFiberKeyError(execId, key);
    }
    return { execId, key };
  }

  public readonly policyType: typeof FIBER_POLICY_TYPE.$type;
  public readonly execId: string;
  public readonly key: FiberKey;
  public readonly segments: string[];

  public status: typeof FIBER_STATUS.$type;
  public dataRef: string | null;

  public get length() {
    return this.segments.length;
  }

  public get nodeId() {
    // TODO: revisit this. Maybe there can be a case when the fiber has no segments.
    const nodeId = this.segments.at(-1);
    if (!nodeId) throw new Error('Fiber has no segments. This is a bug!');
    return nodeId;
  }

  public get ordinality() {
    if (!this.key.lastSegment) {
      throw new Error('Fiber has no ordinality. This is a bug!');
    }
    return Number.parseInt(this.key.lastSegment);
  }

  // TODO: maybe move it to a dedicated utility
  public get scopeType() {
    if (this.policyType === FIBER_POLICY_TYPE.enum.FORK) {
      return FIBER_SCOPE_TYPE.enum.FORK;
    }
    if (this.policyType === FIBER_POLICY_TYPE.enum.JOIN) {
      return FIBER_SCOPE_TYPE.enum.JOIN;
    }
    throw new Error('Invalid fiber policy type');
  }

  protected constructor(props: FiberJSON) {
    this.execId = props.execId;
    this.key = FiberKey.fromKeyString(props.key);
    this.segments = props.segments;
    this.dataRef = props.dataRef;
    this.status = props.status;
    this.policyType = props.policyType;
  }

  toJSON(): FiberJSON {
    return {
      execId: this.execId,
      key: this.key.toString(),
      segments: this.segments,
      dataRef: this.dataRef,
      status: this.status,
      policyType: this.policyType,
    };
  }

  /**
   * Iterates over the fiber path segments (node ids) in reverse order
   * and returns the key prefix, corresponding to the first (in reverse order) segment (nodeId)
   * that matches the predicate.
   *
   * @example
   * ```
   * const fiber = Fiber.fromJSON({
   *   execId: 'exec-1',
   *   key: '-/1/-/2',
   *   segments: ['r', 'r/enum', 'r/pipe', 'r/batch'],
   *   dataRef: null,
   *   status: FIBER_STATUS.enum.OPEN,
   *   policyType: FIBER_POLICY_TYPE.enum.JOIN,
   * });
   *
   * fiber.keyPrefixByLastMatchingNodeId(id => id === 'r/batch'); // '-/1/-/2'
   * fiber.keyPrefixByLastMatchingNodeId(id => id === 'r/enum'); // '-/1'
   * fiber.keyPrefixByLastMatchingNodeId(id => false); // ''
   * ```
   */
  keyPrefixByLastMatchingNodeId(
    predicate: (nodeId: string, index: number) => boolean,
  ) {
    const segmentIndex = this.segments.findLastIndex(predicate);
    if (segmentIndex === -1) return '';
    return this.key.prefixFrom(segmentIndex).toString();
  }

  keyOfInputFiber(nodeId: string) {
    const segmentIndex = this.segments.findLastIndex(id => id === nodeId);
    if (segmentIndex === -1) return '';
    return this.key.parentPrefixFrom(segmentIndex).toString();
  }

  scopeKey(anchorNodeId: string, fiberPolicy: ForkFiberPolicy): string;
  scopeKey(
    anchorNodeId: string,
    fiberPolicy: JoinFiberPolicy,
    ordinality: number,
  ): string;
  scopeKey(
    anchorNodeId: string,
    fiberPolicy: JoinFiberPolicy | ForkFiberPolicy,
    ordinality?: number,
  ) {
    const prefixKey = this.scopePrefixKey(anchorNodeId, fiberPolicy);

    switch (fiberPolicy.type) {
      case FIBER_POLICY_TYPE.enum.JOIN:
        if (ordinality === undefined || !Number.isInteger(ordinality)) {
          // TODO: custom error for this
          throw new Error('Ordinality must be an integer');
        }
        return FiberKey.fromSegments([
          prefixKey,
          FiberKey.CHARS.ANY,
          ordinality.toString(),
        ]).toString();

      case FIBER_POLICY_TYPE.enum.FORK:
        return FiberKey.fromSegments([
          prefixKey,
          FiberKey.CHARS.ANY,
        ]).toString();

      default:
        // TODO: custom error for this
        throw new Error(
          `Invalid fiber policy type "${fiberPolicy satisfies never}" to create the scope key`,
        );
    }
  }

  scopePrefixKey(anchorNodeId: string, fiberPolicy: FiberPolicy) {
    const anchorIndex = this.segments.indexOf(anchorNodeId);

    switch (fiberPolicy.type) {
      case FIBER_POLICY_TYPE.enum.JOIN: {
        if (anchorIndex === -1) {
          throw new Error(
            'Anchor node not found in fiber, but required to create the join scope prefix key',
          );
        }
        return this.key.prefixFrom(anchorIndex).toString();
      }

      case FIBER_POLICY_TYPE.enum.FORK: {
        if (anchorIndex === -1) return this.key.toString();
        return this.key.parentPrefixFrom(anchorIndex).toString();
      }

      default:
        // TODO: custom error for this
        throw new Error(
          `Invalid fiber policy type "${fiberPolicy.type}" for creating the scope prefix key`,
        );
    }
  }

  pipe(otherNodeId: string) {
    this.ensureClosed();

    return new Fiber({
      execId: this.execId,
      key: this.key.extend(FiberKey.CHARS.PIPE).toString(),
      segments: [...this.segments, otherNodeId],
      dataRef: null,
      status: FIBER_STATUS.enum.OPEN,
      policyType: FIBER_POLICY_TYPE.enum.PIPE,
    });
  }

  fork(otherNodeId: string, ordinality: number) {
    this.ensureClosed();

    const key =
      this.nodeId === otherNodeId
        ? this.key.fork(ordinality.toString())
        : this.key.extend(ordinality.toString());

    return new Fiber({
      execId: this.execId,
      key: key.toString(),
      segments: [...this.segments, otherNodeId],
      dataRef: null,
      status: FIBER_STATUS.enum.OPEN,
      policyType: FIBER_POLICY_TYPE.enum.FORK,
    });
  }

  join(otherNodeId: string, ordinality: number) {
    this.ensureClosed();

    return new Fiber({
      execId: this.execId,
      key: this.key.extend(ordinality.toString()).toString(),
      segments: [...this.segments, otherNodeId],
      dataRef: null,
      status: FIBER_STATUS.enum.OPEN,
      policyType: FIBER_POLICY_TYPE.enum.JOIN,
    });
  }

  close(closeDataRef: string | null) {
    if (this.status === FIBER_STATUS.enum.CLOSED) {
      throw new FiberAlreadyClosedError(this.execId, this.key.toString());
    }

    this.dataRef = closeDataRef;
    this.status = FIBER_STATUS.enum.CLOSED;
  }

  private ensureClosed() {
    if (this.status === FIBER_STATUS.enum.OPEN) {
      throw new FiberNotClosedError(this.execId, this.key.toString());
    }
  }
}

export type FiberAny = Fiber;

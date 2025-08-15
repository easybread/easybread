import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

import { FiberNotClosedError, InvalidFiberKeyError } from '../Error';
import type { IOConstraint } from '../helpers/IO';

import { FiberKey } from './FiberKey';
import { FIBER_POLICY_TYPE, type FiberPolicyType } from './FiberPolicy';

export const FIBER_STATUS = enumSuiteObject(enumObject(['OPEN', 'CLOSED']));

export type FiberJSON<D extends IOConstraint | null> = {
  execId: string;
  key: string;
  segments: string[];
  data: D;
  status: typeof FIBER_STATUS.$type;
};

export type FiberJSONAny = FiberJSON<IOConstraint | null>;

export class Fiber<D extends IOConstraint | null> {
  static fromJSON<J extends FiberJSONAny>(json: J): Fiber<J['data']> {
    return new Fiber(json);
  }

  static pkEncode(options: { execId: string; key: string }) {
    return `${options.execId}:${options.key}`;
  }

  static pkDecode(pk: string) {
    const [execId, key] = pk.split(':');
    if (!execId || !key) {
      throw new InvalidFiberKeyError(execId, key);
    }
    return { execId, key };
  }

  public readonly execId: string;
  public readonly segments: string[];
  public readonly status: typeof FIBER_STATUS.$type;
  public readonly key: FiberKey;
  public readonly data: D;

  public get length() {
    return this.segments.length;
  }

  public get nodeId() {
    // TODO: revisit this. Maybe there can be a case when the fiber has no segments.
    return this.segments.at(-1)!;
  }

  protected constructor(props: FiberJSON<D>) {
    this.execId = props.execId;
    this.key = FiberKey.fromKeyString(props.key);
    this.segments = props.segments;
    this.data = props.data;
    this.status = props.status;
  }

  toJSON(): FiberJSON<D> {
    return {
      execId: this.execId,
      key: this.key.toString(),
      segments: this.segments,
      data: this.data,
      status: this.status,
    };
  }

  scopeKey(
    anchorNodeId: string,
    policyType: typeof FIBER_POLICY_TYPE.enum.FIBER_JOIN,
    ordinality: number,
  ): string;
  scopeKey(
    anchorNodeId: string,
    policyType:
      | typeof FIBER_POLICY_TYPE.enum.FIBER_FORK
      | typeof FIBER_POLICY_TYPE.enum.WORKFLOW_FORK,
  ): string;
  scopeKey(
    anchorNodeId: string,
    policyType: FiberPolicyType,
    ordinality?: number,
  ) {
    const prefixKey = this.scopePrefixKey(anchorNodeId, policyType);

    if (policyType === FIBER_POLICY_TYPE.enum.FIBER_JOIN) {
      return `${prefixKey}/*/${ordinality}`;
    }

    if (
      policyType === FIBER_POLICY_TYPE.enum.WORKFLOW_FORK ||
      policyType === FIBER_POLICY_TYPE.enum.FIBER_FORK
    ) {
      return `${prefixKey}/*`;
    }

    throw new Error(
      `Invalid policy type "${policyType}" to create the scope key`,
    );
  }

  scopePrefixKey(anchorNodeId: string, policyType: FiberPolicyType) {
    const anchorIndex = this.segments.indexOf(anchorNodeId);

    switch (policyType) {
      case FIBER_POLICY_TYPE.enum.FIBER_JOIN: {
        if (anchorIndex === -1) {
          throw new Error(
            'Anchor node not found in fiber, but required to create the join scope prefix key',
          );
        }
        return this.key.prefixFrom(anchorIndex).toString();
      }

      case FIBER_POLICY_TYPE.enum.WORKFLOW_FORK:
      case FIBER_POLICY_TYPE.enum.FIBER_FORK: {
        if (anchorIndex === -1) return this.key.toString();
        return this.key.parentPrefixFrom(anchorIndex).toString();
      }

      default:
        // TODO: custom error for this
        throw new Error(
          `Invalid fiber policy "${policyType}" for creating the scope prefix key`,
        );
    }
  }

  pipe(nodeId: string) {
    this.ensureClosed();

    return new Fiber({
      execId: this.execId,
      key: this.key.extend('-').toString(),
      segments: [...this.segments, nodeId],
      data: null,
      status: FIBER_STATUS.enum.OPEN,
    });
  }

  fork(nodeId: string, ordinality: number) {
    this.ensureClosed();

    const key =
      this.segments.at(-1) === nodeId
        ? this.key.fork(ordinality.toString())
        : this.key.extend(ordinality.toString());

    return new Fiber({
      execId: this.execId,
      key: key.toString(),
      segments: [...this.segments, nodeId],
      data: null,
      status: FIBER_STATUS.enum.OPEN,
    });
  }

  join(nodeId: string, ordinality: number) {
    this.ensureClosed();

    return new Fiber({
      execId: this.execId,
      key: this.key.extend(ordinality.toString()).toString(),
      segments: [...this.segments, nodeId],
      data: null,
      status: FIBER_STATUS.enum.OPEN,
    });
  }

  private ensureClosed() {
    if (this.status === FIBER_STATUS.enum.OPEN) {
      throw new FiberNotClosedError(this.execId, this.key.toString());
    }
  }
}

export type FiberAny = Fiber<IOConstraint | null>;

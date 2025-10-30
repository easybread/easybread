import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

import type { IOConstraint } from '../helpers/IO';

import type { Exit } from './Exit';
import { NodeStateKeyPattern } from './keyPatterns/NodeStateKeyPattern';

export const NODE_STATE_STATUS = enumSuiteObject(
  enumObject(['OPEN', 'EXITED']),
);

export type NodeStateStatus = typeof NODE_STATE_STATUS.$type;

export type NodeStateJSON = {
  execId: string;
  nodeId: string;
  stateKey: string;
  status: NodeStateStatus;
  exit?: Exit;
  data: IOConstraint;
  // this node runs scheduled
  membersOpened: number;
  // this node runs completed
  membersClosed: number;

  // direct children run scheduled
  childrenOpened: number;
  // direct children
  childrenExited: number;
};

export type NodeStateValue<D extends IOConstraint = null> = {
  status: NodeStateStatus;
  exit?: Exit;
  data: D;
  openChildrenCount: number;
  closedChildrenCount: number;
  exitedChildrenCount: number;
};

export class NodeState<D extends IOConstraint = null> {
  static createEmpty<D extends IOConstraint = null>({
    execId,
    nodeId,
    stateKey,
    data,
  }: {
    execId: string;
    nodeId: string;
    stateKey: string;
    data: D;
  }) {
    return NodeState.fromJSON({
      execId,
      nodeId,
      stateKey,
      status: NODE_STATE_STATUS.enum.OPEN,
      openChildrenCount: 0,
      closedChildrenCount: 0,
      exitedChildrenCount: 0,
      data,
    });
  }

  static fromJSON<D extends IOConstraint = null>(
    json: NodeStateJSON & { data: D },
  ): NodeState<D> {
    // TODO: validate
    return new NodeState(
      NodeStateKeyPattern.make({
        execId: json.execId,
        nodeId: json.nodeId,
        stateKey: json.stateKey,
      }),
      json,
    );
  }

  readonly key: NodeStateKeyPattern;

  get status() {
    return this.value.status;
  }

  get data() {
    return this.value.data;
  }

  get exit() {
    return this.value.exit;
  }

  get hasExited() {
    return this.status === 'EXITED';
  }

  private readonly value: NodeStateValue<D>;

  private constructor(key: NodeStateKeyPattern, value: NodeStateValue<D>) {
    this.key = key;
    this.value = value;
  }

  toJSON(): NodeStateJSON {
    return {
      ...this.value,
      execId: this.key.execId,
      nodeId: this.key.nodeId,
      stateKey: this.key.stateKey,
    };
  }
}

const state = NodeState.fromJSON({
  execId: '1',
  nodeId: 'r/batch',
  stateKey: '-/~/0',
  status: NODE_STATE_STATUS.enum.IDLE,
  openChildrenCount: 0,
  closedChildrenCount: 0,
  exitedChildrenCount: 0,
  data: { foo: 'bar' } as const,
});

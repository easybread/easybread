import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

import { BreadEvent } from '@easybread/core';

import type { Exit } from './Exit';
import { type None, Option, type Some } from './helpers/Option';

export const WORKFLOW_EVENT_NAME = enumSuiteObject(
  enumObject(['FIBER_CLOSED', 'NODE_EXITED', 'NODE_SCHEDULED']),
);

export interface WorkflowEventProps {
  execId: string;
  nodeId: string;
  fiberKey: string;
}

export abstract class WorkflowEvent<T = Option<any>> extends BreadEvent<T> {
  abstract readonly name: typeof WORKFLOW_EVENT_NAME.$type;

  readonly execId: string;
  readonly nodeId: string;
  readonly fiberKey: string;

  constructor(props: WorkflowEventProps, payload: T) {
    super(payload);
    this.execId = props.execId;
    this.nodeId = props.nodeId;
    this.fiberKey = props.fiberKey;
  }
}

export class FiberClosedEvent extends WorkflowEvent<None> {
  readonly name = WORKFLOW_EVENT_NAME.enum.FIBER_CLOSED;

  constructor(props: WorkflowEventProps) {
    super(props, Option.none());
  }
}

export class NodeExitedEvent extends WorkflowEvent<Some<Exit>> {
  readonly name = WORKFLOW_EVENT_NAME.enum.NODE_EXITED;

  constructor(props: WorkflowEventProps, exit: Exit) {
    super(props, Option.some(exit));
  }
}

export class NodeScheduledEvent extends WorkflowEvent<
  Some<{ targetNodeId: string }>
> {
  readonly name = WORKFLOW_EVENT_NAME.enum.NODE_SCHEDULED;

  constructor(props: WorkflowEventProps, payload: { targetNodeId: string }) {
    super(props, Option.some(payload));
  }
}

export type WorkflowEventAny =
  | FiberClosedEvent
  | NodeExitedEvent
  | NodeScheduledEvent;

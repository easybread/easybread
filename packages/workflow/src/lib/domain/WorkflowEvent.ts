import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

import { BreadEvent } from '@easybread/core';

import { type None, Option, type Some } from '../helpers/Option';

import type { Exit } from './Exit';
import type { Fiber } from './Fiber';

export const WORKFLOW_EVENT_NAME = enumSuiteObject(
  enumObject(['FIBER_CLOSED', 'NODE_EXITED', 'NODE_SCHEDULED']),
);

export interface WorkflowEventProps {
  execId: string;
  nodeId: string;
  fiberKey: string;
  timestamp?: string;
}

export interface WorkflowEventJSON {
  name: typeof WORKFLOW_EVENT_NAME.$type;
  execId: string;
  nodeId: string;
  fiberKey: string;
  payload: any;
  timestamp: string;
}

export type WorkflowEventPKDecoded = {
  execId: string;
  name: typeof WORKFLOW_EVENT_NAME.$type;
  nodeId: string;
  fiberKey: string;
};

export type WorkflowEventPKEncodeInput = Record<
  keyof WorkflowEventPKDecoded,
  string
>;

export abstract class WorkflowEvent<
  TName extends typeof WORKFLOW_EVENT_NAME.$type,
  TPayload = Option<any>,
> extends BreadEvent<TPayload> {
  static encodePK(event: WorkflowEventPKEncodeInput) {
    return [event.execId, event.name, event.nodeId, event.fiberKey].join(':');
  }

  static decodePK(pk: string): WorkflowEventPKDecoded {
    const [execId, name, nodeId, fiberKey] = pk.split(':');

    if (!execId || !name || !nodeId || !fiberKey) {
      throw new Error('Invalid event PK');
    }
    if (!WORKFLOW_EVENT_NAME.hasValue(name)) {
      throw new Error('Invalid event name');
    }

    return {
      name,
      execId,
      nodeId,
      fiberKey,
    };
  }

  static fromJSON(json: WorkflowEventJSON): WorkflowEventAny {
    const { name, execId, nodeId, fiberKey, payload, timestamp } = json;

    switch (name) {
      case WORKFLOW_EVENT_NAME.enum.FIBER_CLOSED:
        return new FiberClosedEvent({ execId, fiberKey, nodeId, timestamp });

      case WORKFLOW_EVENT_NAME.enum.NODE_EXITED:
        return new NodeExitedEvent(
          { execId, fiberKey, nodeId, timestamp },
          payload as Exit,
        );

      case WORKFLOW_EVENT_NAME.enum.NODE_SCHEDULED:
        return new NodeScheduledEvent(
          { execId, fiberKey, nodeId, timestamp },
          payload as { targetNodeId: string },
        );

      default:
        throw new Error(`Unknown event name: ${name satisfies never}`);
    }
  }

  readonly name: TName;
  readonly execId: string;
  readonly nodeId: string;
  readonly fiberKey: string;
  readonly timestamp: string;

  constructor(name: TName, props: WorkflowEventProps, payload: TPayload) {
    super(payload);
    this.name = name;
    this.execId = props.execId;
    this.nodeId = props.nodeId;
    this.fiberKey = props.fiberKey;
    this.timestamp = props.timestamp ?? new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      execId: this.execId,
      nodeId: this.nodeId,
      fiberKey: this.fiberKey,
      payload: this.payload,
      timestamp: this.timestamp,
    };
  }
}

export class FiberClosedEvent extends WorkflowEvent<
  typeof WORKFLOW_EVENT_NAME.enum.FIBER_CLOSED,
  None
> {
  constructor(props: WorkflowEventProps) {
    super(WORKFLOW_EVENT_NAME.enum.FIBER_CLOSED, props, Option.none());
  }
}

export class NodeExitedEvent extends WorkflowEvent<
  typeof WORKFLOW_EVENT_NAME.enum.NODE_EXITED,
  Some<Exit>
> {
  constructor(props: WorkflowEventProps, exit: Exit) {
    super(WORKFLOW_EVENT_NAME.enum.NODE_EXITED, props, Option.some(exit));
  }
}

export class NodeScheduledEvent extends WorkflowEvent<
  typeof WORKFLOW_EVENT_NAME.enum.NODE_SCHEDULED,
  Some<{ targetNodeId: string }>
> {
  static forFiber(fiber: Fiber, targetNodeId: string) {
    return new NodeScheduledEvent(
      {
        execId: fiber.execId,
        fiberKey: fiber.key.toString(),
        nodeId: fiber.nodeId,
      },
      { targetNodeId },
    );
  }

  constructor(props: WorkflowEventProps, payload: { targetNodeId: string }) {
    super(WORKFLOW_EVENT_NAME.enum.NODE_SCHEDULED, props, Option.some(payload));
  }
}

export type WorkflowEventAny =
  | FiberClosedEvent
  | NodeExitedEvent
  | NodeScheduledEvent;

import { EventKeyPattern } from './EventKeyPattern';
import type { Fiber } from './Fiber';
import type { NodeAny } from './Node';
import { WORKFLOW_EVENT_NAME } from './WorkflowEvent';

export class BackpressureEventKeyPattern extends EventKeyPattern {
  static make = this.createFactoryMethod(this.PATTERN_TEMPLATE);
  static forGlobal(fiber: Fiber, node: NodeAny) {
    return this.make({
      execId: fiber.execId,
      eventName: WORKFLOW_EVENT_NAME.enum.NODE_SCHEDULED,
      nodeId: node.id,
      fiberKey: EventKeyPattern.WILDCARDS.ONE_SEGMENT,
    });
  }

  static forNearestFork(fiber: Fiber, node: NodeAny, forkNodeId: string) {
    return this.make({
      execId: fiber.execId,
      eventName: WORKFLOW_EVENT_NAME.enum.NODE_SCHEDULED,
      nodeId: node.id,
      fiberKey: this.makePathSegmentWildcardByPrefix(forkNodeId),
    });
  }
}

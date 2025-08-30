import {
  type CloseFiberIntentAny,
  INTENT_TYPE,
  type IntentAny,
  type RunNodeIntent,
} from './Intent';
import type { ServiceRegistry } from './ServiceRegistry';
import {
  FiberClosedEvent,
  NodeScheduledEvent,
  type WorkflowEventAny,
} from './domain/WorkflowEvent';
import { FiberStore } from './stores/FiberStore';

export class IntentsProcessor {
  private readonly serviceRegistry: ServiceRegistry;

  private get fiberStore() {
    return this.serviceRegistry.getInstance(FiberStore);
  }

  constructor(serviceRegistry: ServiceRegistry) {
    this.serviceRegistry = serviceRegistry;
  }

  /**
   * Processes a list of intents, updates the stores and returns a list of events
   * to publush.
   *
   * @param intents - The list of intents to process.
   * @returns A list of events.
   */
  async process(intents: IntentAny[]): Promise<WorkflowEventAny[]> {
    const allEvents: WorkflowEventAny[] = [];

    for (const intent of intents) {
      const events = await this.processOneIntent(intent);
      allEvents.push(...events);
    }

    return allEvents;
  }

  private async processOneIntent(
    intent: IntentAny,
  ): Promise<WorkflowEventAny[]> {
    switch (intent.type) {
      case INTENT_TYPE.enum.CLOSE_FIBER:
        return await this.processCloseFiberIntent(intent);

      case INTENT_TYPE.enum.RUN_NODE:
        return await this.processRunNodeIntent(intent);

      default:
        return [];
    }
  }

  private async processRunNodeIntent(
    intent: RunNodeIntent,
  ): Promise<WorkflowEventAny[]> {
    const { fiber, nodeId } = intent.payload;
    return [
      new NodeScheduledEvent(
        {
          execId: fiber.execId,
          fiberKey: fiber.key.toString(),
          nodeId: fiber.nodeId,
        },
        { targetNodeId: nodeId },
      ),
    ];
  }

  private async processCloseFiberIntent(
    intent: CloseFiberIntentAny,
  ): Promise<WorkflowEventAny[]> {
    const { fiber, data } = intent.payload;
    await this.fiberStore.closeFiber(fiber, data);

    return [
      new FiberClosedEvent({
        execId: fiber.execId,
        fiberKey: fiber.key.toString(),
        nodeId: fiber.nodeId,
      }),
    ];
  }
}

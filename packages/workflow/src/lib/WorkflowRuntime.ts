import { ContextFactory } from './ContextFactory';
import { WorkflowBackpressureError } from './Error';
import { Intent } from './Intent';
import { IntentsProcessor } from './IntentsProcessor';
import { WorkflowGraph } from './WorkflowGraph';
import type { WorkflowRuntimeStores } from './WorkflowRuntimeStores';
import type { WorkflowStoreAdapter } from './WorkflowStoreAdapter';
import { BACKPRESSURE_POLICY_TYPE } from './domain/BackpressurePolicy';
import { DelayedQueuePoller } from './domain/EventsDelayedPoller';
import { EventsReadyPoller } from './domain/EventsReadyPoller';
import type { Fiber } from './domain/Fiber';
import { EventMatchPattern } from './domain/KeyPattern';
import type { NodeAny } from './domain/Node';
import {
  type FiberClosedEvent,
  type NodeScheduledEvent,
  WORKFLOW_EVENT_NAME,
  type WorkflowEventAny,
} from './domain/WorkflowEvent';
import { Option } from './helpers/Option';
import { DataStore } from './stores/DataStore';
import { EventStore } from './stores/EventStore';
import { FiberStore } from './stores/FiberStore';

export class WorkflowRuntime<TRoot extends NodeAny> {
  private readonly graph: WorkflowGraph<TRoot>;
  private readonly stores: WorkflowRuntimeStores;
  private readonly contextFactory: ContextFactory;
  private readonly intentsProcessor: IntentsProcessor;

  private eventsReadyPoller: EventsReadyPoller | null = null;
  private eventsDelayedPoller: DelayedQueuePoller | null = null;

  static create<TRoot extends NodeAny>(
    root: TRoot,
    storeAdapter: WorkflowStoreAdapter,
  ) {
    // TODO: create execution;
    return new WorkflowRuntime(root, storeAdapter);
  }

  private constructor(root: TRoot, storeAdapter: WorkflowStoreAdapter) {
    this.graph = new WorkflowGraph(root);
    this.stores = {
      data: new DataStore(storeAdapter),
      fiber: new FiberStore(storeAdapter),
      event: new EventStore(storeAdapter),
    };
    this.contextFactory = new ContextFactory(this.stores);
    this.intentsProcessor = new IntentsProcessor(this.stores);
  }

  async resumeExecution(execId: string) {
    // load all data
    // re-start in-progress nodes
    // resume subscription
    const pattern = EventMatchPattern.make({
      execId,
      eventName: EventMatchPattern.WILDCARDS.ANY_SEGMENT,
      nodeId: EventMatchPattern.WILDCARDS.ANY_SEGMENT,
      fiberKey: EventMatchPattern.WILDCARDS.ANY_SEGMENT,
    });

    this.eventsReadyPoller = new EventsReadyPoller(
      this.stores.event,
      pattern,
      this.onEventBatch.bind(this),
    );

    throw new Error('not implemented');
  }

  async startNewExecution() {
    // TODO: create execution
    const execId = '123';

    const pattern = EventMatchPattern.make({
      execId,
      eventName: EventMatchPattern.WILDCARDS.ANY_SEGMENT,
      nodeId: EventMatchPattern.WILDCARDS.ANY_SEGMENT,
      fiberKey: EventMatchPattern.WILDCARDS.ANY_SEGMENT,
    });

    this.eventsReadyPoller = new EventsReadyPoller(
      this.stores.event,
      pattern,
      this.onEventBatch.bind(this),
    );

    this.eventsDelayedPoller = new DelayedQueuePoller(
      this.stores.event,
      pattern.execId,
    );

    this.eventsReadyPoller.start();
    this.eventsDelayedPoller.start();

    // - create a fiber eligible for root node execution (`{execId}`)
    // - run the root node
    // TODO: refine this execution parameters
    this.executeNode(execId, this.graph.getRootNode().id, '-');
  }

  async complete() {
    // update execution store
    this.eventsReadyPoller?.destroy();
  }

  async onEventBatch(events: WorkflowEventAny[]) {
    for (const event of events) this.onEvent(event);
  }

  // TODO: catch ALL exceptions and unlock the event
  async onEvent(event: WorkflowEventAny) {
    try {
      switch (event.name) {
        case WORKFLOW_EVENT_NAME.enum.FIBER_CLOSED:
          await this.onFiberClosed(event);
          break;

        case WORKFLOW_EVENT_NAME.enum.NODE_SCHEDULED:
          await this.onNodeScheduled(event);
          break;
      }
    } catch (error) {
      // TODO: unlock the event
      if (error instanceof WorkflowBackpressureError) {
        await this.stores.event.rescheduleEvent(
          event,
          error.details.pressure * 20,
        );
      }

      // TODO: handle other errors

      await this.stores.event.rescheduleEvent(event, 300);
    }
  }

  async onNodeScheduled(event: NodeScheduledEvent) {
    const { targetNodeId } = Option.unwrap(event.payload);
    await this.executeNode(event.execId, targetNodeId, event.fiberKey);
    await this.stores.event.ack(event);
  }

  async executeNode(execId: string, nodeId: string, fiberKey: string) {
    const node = this.graph.getNode(nodeId);
    const inputFiber = await this.stores.fiber.getFiber(execId, fiberKey);

    const isBackpressureOk = await this.checkBackpressure(inputFiber, node);

    if (!isBackpressureOk) {
      return;
    }

    // TODO: check concurrency

    const runContext = await this.contextFactory.createNodeRunContext(
      node,
      inputFiber,
    );

    const intents = await node.run(runContext);
    const events = await this.intentsProcessor.process(intents);
    await this.stores.event.writeEvents(events);
  }

  async onFiberClosed(event: FiberClosedEvent) {
    const { execId, fiberKey, nodeId } = event;

    const closedFiber = await this.stores.fiber.getFiber(execId, fiberKey);

    let node: NodeAny | null = this.graph.getNode(nodeId);

    while (node) {
      const intents = await node.onClose(closedFiber);
      const events = await this.intentsProcessor.process(intents);

      await this.stores.event.writeEvents(events);

      if (Intent.hasStopPropagation(intents)) {
        break;
      }

      node = this.graph.getParentNode(node.id);
    }
  }

  async checkBackpressure(runFiber: Fiber, node: NodeAny) {
    switch (node.backpressurePolicy.type) {
      case BACKPRESSURE_POLICY_TYPE.enum.NONE:
        return 0;

      case BACKPRESSURE_POLICY_TYPE.enum.GLOBAL: {
        const messagesCount = await this.stores.event.estimateEventCount(
          EventMatchPattern.make({
            eventName: WORKFLOW_EVENT_NAME.enum.NODE_SCHEDULED,
            execId: runFiber.execId,
            nodeId: node.id,
            fiberKey: EventMatchPattern.WILDCARDS.ANY_SEGMENT,
          }),
        );
        return messagesCount < node.backpressurePolicy.threshold;
      }

      case BACKPRESSURE_POLICY_TYPE.enum.NEAREST_FORK: {
        const keyPrefix = runFiber.keyPrefixByLastMatchingNodeId(nodeId => {
          const node = this.graph.getNode(nodeId);
          return node.isFork();
        });

        const messagesCount = await this.stores.event.estimateEventCount(
          EventMatchPattern.make({
            eventName: WORKFLOW_EVENT_NAME.enum.NODE_SCHEDULED,
            execId: runFiber.execId,
            nodeId: node.id,
            fiberKey: EventMatchPattern.makeFiberKeyOption({
              keyPartial: keyPrefix,
              suffixWildcard: EventMatchPattern.WILDCARDS.ANY_SEGMENT,
            }),
          }),
        );

        return messagesCount - node.backpressurePolicy.threshold;
      }

      default:
        throw new Error('Unsupported backpressure policy');
    }
  }
}

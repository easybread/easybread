import { ContextFactory } from './ContextFactory';
import { WorkflowBackpressureError } from './Error';
import { Intent } from './Intent';
import { IntentsProcessor } from './IntentsProcessor';
import { ServiceRegistry } from './ServiceRegistry';
import type { StoreAdapter } from './StoreAdapter';
import { WorkflowGraph } from './WorkflowGraph';
import type { WorkflowRuntimeStores } from './WorkflowRuntimeStores';
import { BackpressureEventKeyPattern } from './domain/BackpressureEventKeyPattern';
import { BACKPRESSURE_POLICY_TYPE } from './domain/BackpressurePolicy';
import { EventKeyPattern } from './domain/EventKeyPattern';
import { DelayedQueuePoller } from './domain/EventsDelayedPoller';
import { EventsReadyPoller } from './domain/EventsReadyPoller';
import type { Fiber } from './domain/Fiber';
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
  private readonly serviceRegistry: ServiceRegistry;

  private get graph(): WorkflowGraph<TRoot> {
    return this.serviceRegistry.getInstance(WorkflowGraph<TRoot>);
  }
  private get contextFactory(): ContextFactory {
    return this.serviceRegistry.getInstance(ContextFactory);
  }
  private get intentsProcessor(): IntentsProcessor {
    return this.serviceRegistry.getInstance(IntentsProcessor);
  }

  private get stores(): WorkflowRuntimeStores {
    return {
      event: this.serviceRegistry.getInstance(EventStore),
      fiber: this.serviceRegistry.getInstance(FiberStore),
      data: this.serviceRegistry.getInstance(DataStore),
    };
  }

  private eventsReadyPoller: EventsReadyPoller | null = null;
  private eventsDelayedPoller: DelayedQueuePoller | null = null;

  static create<TRoot extends NodeAny>(
    root: TRoot,
    storeAdapter: StoreAdapter,
  ) {
    // TODO: create execution;
    return new WorkflowRuntime(root, storeAdapter);
  }

  private constructor(root: TRoot, storeAdapter: StoreAdapter) {
    this.serviceRegistry = new ServiceRegistry();
    this.serviceRegistry.registerMultipleInstances(
      this,
      storeAdapter,
      new WorkflowGraph(root),
      new DataStore(storeAdapter),
      new FiberStore(storeAdapter),
      new EventStore(storeAdapter),
      new ContextFactory(this.serviceRegistry),
      new IntentsProcessor(this.serviceRegistry),
    );
  }

  async resumeExecution(execId: string) {
    // load all data
    // re-start in-progress nodes
    // resume subscription
    const pattern = EventKeyPattern.make({
      execId,
      eventName: EventKeyPattern.WILDCARDS.ONE_SEGMENT,
      nodeId: EventKeyPattern.WILDCARDS.ONE_SEGMENT,
      fiberKey: EventKeyPattern.WILDCARDS.ONE_SEGMENT,
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

    const eventMatchPattern = EventKeyPattern.make({
      execId,
      eventName: EventKeyPattern.WILDCARDS.ONE_SEGMENT,
      nodeId: EventKeyPattern.WILDCARDS.ONE_SEGMENT,
      fiberKey: EventKeyPattern.WILDCARDS.ONE_SEGMENT,
    });

    this.eventsReadyPoller = new EventsReadyPoller(
      this.stores.event,
      eventMatchPattern,
      this.onEventBatch.bind(this),
    );

    this.eventsDelayedPoller = new DelayedQueuePoller(
      this.stores.event,
      eventMatchPattern.execId,
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
        const pattern = BackpressureEventKeyPattern.forGlobal(runFiber, node);

        const count = await this.stores.event.estimateEventCount(pattern);
        return count < node.backpressurePolicy.threshold;
      }

      case BACKPRESSURE_POLICY_TYPE.enum.NEAREST_FORK: {
        const keyPrefix = runFiber.keyPrefixByLastMatchingNodeId(nodeId => {
          const node = this.graph.getNode(nodeId);
          return node.isFork();
        });

        const pattern = BackpressureEventKeyPattern.forNearestFork(
          runFiber,
          node,
          keyPrefix,
        );

        const count = await this.stores.event.estimateEventCount(pattern);

        return count < node.backpressurePolicy.threshold;
      }

      default:
        throw new Error('Unsupported backpressure policy');
    }
  }
}

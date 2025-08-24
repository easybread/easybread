import { ContextFactory } from './ContextFactory';
import { WorkflowBackpressureError } from './Error';
import { Intent } from './Intent';
import { IntentsProcessor } from './IntentsProcessor';
import { WorkflowGraph } from './WorkflowGraph';
import type { WorkflowRuntimeStores } from './WorkflowRuntimeStores';
import type { WorkflowStoreAdapter } from './WorkflowStoreAdapter';
import { BACKPRESSURE_POLICY_TYPE } from './domain/BackpressurePolicy';
import { EventMatchPattern } from './domain/EventMatchPattern';
import { EventStoreSubscription } from './domain/EventStoreSubscription';
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
  private readonly graph: WorkflowGraph<TRoot>;
  private readonly stores: WorkflowRuntimeStores;
  private readonly contextFactory: ContextFactory;
  private readonly intentsProcessor: IntentsProcessor;
  private subscription: EventStoreSubscription | null = null;

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
    this.subscription = EventStoreSubscription.make(
      this.stores.event,
      EventMatchPattern.make({
        execId,
        eventName: EventMatchPattern.WILDCARDS.SQEUENCE,
        nodeId: EventMatchPattern.WILDCARDS.SQEUENCE,
        fiberKey: EventMatchPattern.WILDCARDS.SQEUENCE,
      }),
      event => this.onEvent(event),
    );
    throw new Error('not implemented');
  }

  async startNewExecution() {
    // TODO: create execution
    const execId = '123';

    this.subscription = EventStoreSubscription.make(
      this.stores.event,
      EventMatchPattern.make({
        execId,
        eventName: EventMatchPattern.WILDCARDS.SQEUENCE,
        nodeId: EventMatchPattern.WILDCARDS.SQEUENCE,
        fiberKey: EventMatchPattern.WILDCARDS.SQEUENCE,
      }),
      event => this.onEvent(event),
    );
  }

  async complete() {
    // update execution store
    this.subscription?.destroy();
  }

  async onEvent(event: WorkflowEventAny) {
    // TODO: catch ALL exceptions and unlock the event

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
      throw error;
    }
  }

  async onNodeScheduled(event: NodeScheduledEvent) {
    const { targetNodeId } = Option.unwrap(event.payload);
    await this.executeNode(event.execId, targetNodeId, event.fiberKey);
    await this.eventQueue.ack(event);
  }

  async onFiberClosed(event: FiberClosedEvent) {
    const { execId, fiberKey, nodeId } = event;

    // TODO: ack event

    const closedFiber = await this.stores.fiber.getFiber(execId, fiberKey);

    let node: NodeAny | null = this.graph.getNode(nodeId);

    while (node) {
      const intents = await node.onClose(closedFiber);
      const events = await this.intentsProcessor.process(intents);

      await this.eventQueue.publish(events);

      if (Intent.hasStopPropagation(intents)) {
        break;
      }

      node = this.graph.getParentNode(node.id);
    }
  }

  async executeNode(execId: string, nodeId: string, fiberKey: string) {
    const node = this.graph.getNode(nodeId);
    const inputFiber = await this.stores.fiber.getFiber(execId, fiberKey);

    const isBackpressureOk = await this.checkBackpressure(inputFiber, node);

    if (!isBackpressureOk) {
      return;
    }

    //--------------------------------------------
    // TODO: check concurrency
    //--------------------------------------------

    const runContext = await this.contextFactory.createNodeRunContext(
      node,
      inputFiber,
    );

    const intents = await node.run(runContext);
    const events = await this.intentsProcessor.process(intents);
    await this.eventQueue.publish(events);
  }

  async checkBackpressure(runFiber: Fiber, node: NodeAny) {
    switch (node.backpressurePolicy.type) {
      case BACKPRESSURE_POLICY_TYPE.enum.NONE:
        return 0;

      case BACKPRESSURE_POLICY_TYPE.enum.GLOBAL: {
        const messagesCount = await this.eventQueue.estimateEventCount(
          EventMatchPattern.make({
            eventName: WORKFLOW_EVENT_NAME.enum.NODE_SCHEDULED,
            execId: runFiber.execId,
            nodeId: node.id,
            fiberKey: EventMatchPattern.WILDCARDS.SQEUENCE,
          }),
        );
        return messagesCount < node.backpressurePolicy.threshold;
      }

      case BACKPRESSURE_POLICY_TYPE.enum.NEAREST_FORK: {
        const keyPrefix = runFiber.keyPrefixByLastMatchingNodeId(nodeId => {
          const node = this.graph.getNode(nodeId);
          return node.isFork();
        });

        const messagesCount = await this.eventQueue.estimateEventCount(
          EventMatchPattern.make({
            eventName: WORKFLOW_EVENT_NAME.enum.NODE_SCHEDULED,
            execId: runFiber.execId,
            nodeId: node.id,
            fiberKey: EventMatchPattern.makeFiberKeyOption({
              keyPartial: keyPrefix,
              suffixWildcard: EventMatchPattern.WILDCARDS.SQEUENCE,
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

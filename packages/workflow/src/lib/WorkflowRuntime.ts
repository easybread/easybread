import type { FiberClosedEvent, NodeScheduledEvent } from './WorkflowEvent';
import { WorkflowGraph } from './WorkflowGraph';
import type { WorkflowStoreAdapter } from './WorkflowStoreAdapter';
import type { Fiber } from './domain/Fiber';
import { FIBER_POLICY_TYPE } from './domain/FiberPolicy';
import type {
  ForkNodeAny,
  JoinNodeAny,
  NodeAny,
  PipeNodeAny,
} from './domain/Node';
import {
  ForkNodeRunContext,
  JoinNodeRunContext,
  type NodeRunContext,
  PipeNodeRunContext,
} from './domain/NodeRunContext';
import { Option } from './helpers/Option';
import { DataStore } from './stores/DataStore';
import { FiberStore } from './stores/FiberStore';

class WorkflowRuntime<TRoot extends NodeAny> {
  private readonly graph: WorkflowGraph<TRoot>;
  private readonly fiberStore: FiberStore;
  private readonly dataStore: DataStore;

  constructor(root: TRoot, storeAdapter: WorkflowStoreAdapter) {
    this.graph = new WorkflowGraph(root);
    this.fiberStore = new FiberStore(storeAdapter);
    this.dataStore = new DataStore(storeAdapter);
  }

  async onNodeScheduled(event: NodeScheduledEvent) {
    const { targetNodeId } = Option.unwrap(event.payload);
    await this.executeNode(event.execId, targetNodeId, event.fiberKey);
    // TODO: ack event
  }

  async onFiberClosed(event: FiberClosedEvent) {
    console.log('onFiberClosed', event);
    // TODO: ack event
  }

  async executeNode(execId: string, nodeId: string, fiberKey: string) {
    const node = this.graph.getNode(nodeId);
    const inputFiber = await this.fiberStore.getFiber(execId, fiberKey);

    //--------------------------------------------
    // TODO: check concurrency and backpressure (maybe here)
    //--------------------------------------------

    const runContext = await this.createNodeRunContext(node, inputFiber);

    // TODO: fix this
    // as any is because the NodeAny run type is inferred as intersection of all possible
    // context types. We can fix it by narrowing the node and context types - if we handle each fiber policy
    // separately right here in this method. Which might be a good idea anyway, but for now we'll just use any.
    const intents = await node.run(runContext);

    // const intents = await node.run(inputFiber.data, runFiber);
  }

  async runNode(
    node: NodeAny,
    inputFiber: Fiber,
    context: NodeRunContext<NodeAny>,
  ) {}

  async processIntents(intents: Intent[]) {
    throw new Error('Not implemented');
  }

  async createNodeRunContext(node: NodeAny, inputFiber: Fiber) {
    if (node.fiberPolicy.type === FIBER_POLICY_TYPE.enum.PIPE) {
      const runFiber = await this.fiberStore.openPipeFiber(
        inputFiber,
        node as PipeNodeAny,
      );
      return new PipeNodeRunContext(
        this.makeNodeRunContextStores(),
        node.statePolicy,
        inputFiber,
        runFiber,
      );
    }

    if (node.fiberPolicy.type === FIBER_POLICY_TYPE.enum.FORK) {
      const runFibers = await this.fiberStore.openForkFibers(
        inputFiber,
        node as ForkNodeAny,
      );

      return new ForkNodeRunContext(
        this.makeNodeRunContextStores(),
        node.statePolicy,
        inputFiber,
        runFibers,
      );
    }

    if (node.fiberPolicy.type === FIBER_POLICY_TYPE.enum.JOIN) {
      const runFiber = await this.fiberStore.openJoinFiber(
        inputFiber,
        node as JoinNodeAny,
      );

      return new JoinNodeRunContext(
        this.makeNodeRunContextStores(),
        node.statePolicy,
        runFiber,
      );
    }

    throw new Error('Invalid fiber policy type');
  }

  private makeNodeRunContextStores() {
    return {
      data: this.dataStore,
      fiber: this.fiberStore,
    };
  }
}

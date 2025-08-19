import type { FiberClosedEvent, NodeScheduledEvent } from './WorkflowEvent';
import { WorkflowGraph } from './WorkflowGraph';
import type { WorkflowStoreAdapter } from './WorkflowStoreAdapter';
import type { FiberAny } from './domain/Fiber';
import { FIBER_POLICY_TYPE } from './domain/FiberPolicy';
import type {
  NodeAny,
  NodeAnyWithForkPolicy,
  NodeAnyWithJoinPolicy,
  NodeAnyWithPipePolicy,
} from './domain/Node';
import {
  ForkNodeRunContext,
  JoinNodeRunContext,
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
    const runContext = await this.createNodeRunContext(node, inputFiber);

    const intents = await node.run(runContext);

    // const intents = await node.run(inputFiber.data, runFiber);
  }

  async processIntents(intents: Intent[]) {
    throw new Error('Not implemented');
  }

  async createNodeRunContext(node: NodeAny, inputFiber: FiberAny) {
    if (node.fiberPolicy.type === FIBER_POLICY_TYPE.enum.PIPE) {
      const runFiber = await this.fiberStore.openPipeFiber(
        inputFiber,
        node as NodeAnyWithPipePolicy,
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
        node as NodeAnyWithForkPolicy,
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
        node as NodeAnyWithJoinPolicy,
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

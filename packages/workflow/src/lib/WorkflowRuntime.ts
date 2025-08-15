import type { FiberClosedEvent, NodeScheduledEvent } from './WorkflowEvent';
import type { WorkflowNodeAny } from './WorkflowNode';
import { Option } from './helpers/Option';
import { FiberStore } from './store/FiberStore';
import type { WorkflowStoreAdapter } from './store/WorkflowStoreAdapter';

class WorkflowRuntime<TRoot extends WorkflowNodeAny> {
  private readonly root: TRoot;
  private readonly fiberStore: FiberStore;

  constructor(root: TRoot, storeAdapter: WorkflowStoreAdapter) {
    this.root = root;
    this.fiberStore = new FiberStore(storeAdapter);
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
    const node = this.root.getNode(nodeId);

    const inputFiber = await this.fiberStore.getFiber(execId, fiberKey);

    const runFiber = await this.fiberStore.openFibers(inputFiber, node);

    const intents = await node.run();

    // const intents = await node.run(inputFiber.data, runFiber);
  }
}

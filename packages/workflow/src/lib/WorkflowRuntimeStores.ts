import type { DataStore } from './stores/DataStore';
import type { EventStore } from './stores/EventStore';
import type { FiberStore } from './stores/FiberStore';

export type WorkflowRuntimeStores = {
  data: DataStore;
  fiber: FiberStore;
  event: EventStore;
};

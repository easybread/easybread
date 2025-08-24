import type {
  WorkflowStoreAdapter,
  WorkflowStoreAdapterEventSubscriberFn,
  WorkflowStoreAdapterEventType,
} from './WorkflowStoreAdapter';

export class WorkflowStore {
  protected readonly adapter: WorkflowStoreAdapter;
  protected readonly storePrefix: string;

  constructor(storePrefix: string, adapter: WorkflowStoreAdapter) {
    this.storePrefix = storePrefix;
    this.adapter = adapter;
  }

  subscribe<U extends WorkflowStoreAdapterEventType, T extends U[]>(
    eventType: T,
    callback: WorkflowStoreAdapterEventSubscriberFn<T[number]>,
  ) {
    return this.adapter.subscribe(eventType, callback);
  }

  protected encodeStoreKey(pk: string) {
    return `${this.storePrefix}:${pk}`;
  }
}

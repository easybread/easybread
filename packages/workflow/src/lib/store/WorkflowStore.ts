import type { WorkflowStoreAdapter } from './WorkflowStoreAdapter';

export class WorkflowStore {
  protected readonly adapter: WorkflowStoreAdapter;
  protected readonly storePrefix: string;

  constructor(storePrefix: string, adapter: WorkflowStoreAdapter) {
    this.storePrefix = storePrefix;
    this.adapter = adapter;
  }

  protected encodeStoreKey(pk: string) {
    return `${this.storePrefix}:${pk}`;
  }
}

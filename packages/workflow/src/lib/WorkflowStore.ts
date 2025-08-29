import type { PatternRwLock } from './RWLock';
import type { WorkflowStoreAdapter } from './WorkflowStoreAdapter';

export class WorkflowStore {
  protected readonly adapter: WorkflowStoreAdapter;
  protected readonly storePrefix: string;
  // TODO: use implementation
  protected readonly rwLock: PatternRwLock = {} as PatternRwLock;

  constructor(storePrefix: string, adapter: WorkflowStoreAdapter) {
    this.storePrefix = storePrefix;
    this.adapter = adapter;
  }

  protected encodeStoreKey = (pk: string) => {
    return `${this.storePrefix}:${pk}`;
  };

  protected decodeStoreKey = (key: string) => {
    return key.split(':').slice(1).join(':');
  };
}

import { PatternRwLock } from './RWLock';
import type { ServiceRegistry } from './ServiceRegistry';
import { StoreAdapter } from './StoreAdapter';

export class Store {
  protected get adapter() {
    return this.serviceRegistry.get(StoreAdapter);
  }
  protected readonly storePrefix: string;

  protected readonly serviceRegistry: ServiceRegistry;

  // TODO: use implementation
  protected get rwLock() {
    return this.serviceRegistry.getInstance(PatternRwLock);
  }

  constructor(serviceRegistry: ServiceRegistry, storePrefix: string) {
    this.serviceRegistry = serviceRegistry;
    this.storePrefix = storePrefix;
  }

  protected encodeStoreKey = (pk: string) => {
    return `${this.storePrefix}:${pk}`;
  };

  protected decodeStoreKey = (key: string) => {
    return key.split(':').slice(1).join(':');
  };
}

import { PatternRwLock } from './RWLock';
import type { ServiceRegistry } from './ServiceRegistry';
import { StoreAdapter } from './StoreAdapter';
import type { KeyPatternAny } from './domain/keyPatterns/KeyPattern';

export class Store {
  protected get adapter() {
    return this.serviceRegistry.getInstance(StoreAdapter);
  }

  // TODO: use implementation
  protected get rwLock() {
    return this.serviceRegistry.getInstance(PatternRwLock);
  }

  protected readonly storePrefix: string;
  protected readonly serviceRegistry: ServiceRegistry;

  constructor(serviceRegistry: ServiceRegistry, storePrefix: string) {
    this.serviceRegistry = serviceRegistry;
    this.storePrefix = storePrefix;
  }

  async countKeys<P extends KeyPatternAny>(pattern: P) {
    const encodedPattern = this.encodeStoreKey(pattern.toString());
    let count = 0;
    for await (const key of this.adapter.keysGenerator(encodedPattern)) {
      if (pattern.matchKey(key)) count++;
    }
    return count;
  }

  protected encodeStoreKey = (pk: string) => {
    return `${this.storePrefix}:${pk}`;
  };

  protected decodeStoreKey = (key: string) => {
    return key.split(':').slice(1).join(':');
  };
}

import type { ServiceRegistry } from '../ServiceRegistry';
import { Store } from '../Store';

export class DataStore extends Store {
  constructor(serviceRegistry: ServiceRegistry) {
    super(serviceRegistry, 'DATA');
  }

  randomKey() {
    return crypto.randomUUID();
  }

  async setData<D>(key: string, data: D) {
    const storeKey = this.encodeStoreKey(key);
    await this.adapter.set(storeKey, data);
  }

  async getData<D>(key: string) {
    const storeKey = this.encodeStoreKey(key);
    const data = await this.adapter.get<D>(storeKey);

    if (data == null) {
      throw new Error(`Data not found: ${storeKey}`);
    }

    return data;
  }
}

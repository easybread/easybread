import { Store } from '../Store';
import type { StoreAdapter } from '../StoreAdapter';

export class DataStore extends Store {
  constructor(adapter: StoreAdapter) {
    super('BLOB', adapter);
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

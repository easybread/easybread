import { NotFoundException } from '../exception';
import { BreadStateAdapter } from '../state';

export class InMemoryStateAdapter extends BreadStateAdapter {
  private db = new Map();

  async reset(): Promise<void> {
    this.db.clear();
  }

  async write<T>(key: string, value: T): Promise<T> {
    this.db.set(key, value);
    // eslint-disable-next-line no-console
    console.log('STATE WRITE:');
    // eslint-disable-next-line no-console
    console.log(key, value);
    return value;
  }

  async read<T>(key: string): Promise<T | undefined> {
    return this.db.get(key);
  }

  async remove<T>(key: string): Promise<T | never> {
    const entity = await this.read<T>(key);

    if (!entity) throw new NotFoundException();

    this.db.delete(key);

    return entity;
  }
}

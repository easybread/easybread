export abstract class BreadStateAdapter {
  createStateKey(segments: string[]): string {
    return segments.join(':');
  }

  parseStateKey(key: string): string[] {
    return key.split(':');
  }

  abstract async write<T>(key: string, value: T): Promise<T>;

  abstract async read<T>(key: string): Promise<T | undefined>;

  abstract async remove<T>(key: string): Promise<T | never | void>;
}

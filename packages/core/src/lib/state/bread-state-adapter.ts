export abstract class BreadStateAdapter {
  createStateKey(segments: string[]): string {
    return segments.join(':');
  }

  parseStateKey(key: string): string[] {
    return key.split(':');
  }

  abstract write<T>(key: string, value: T): Promise<T>;

  abstract read<T>(key: string): Promise<T | undefined>;

  abstract remove<T>(key: string): Promise<T | never | void>;
}

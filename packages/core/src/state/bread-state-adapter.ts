export abstract class BreadStateAdapter {
  abstract async write<T>(key: string, value: T): Promise<T>;

  abstract async read<T>(key: string): Promise<T | undefined>;

  abstract async remove<T>(key: string): Promise<T | never>;
}

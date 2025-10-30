export interface ScoreRange {
  min?: number;
  max?: number;
}

export type WorkflowStoreAdapterEventType =
  | 'ALL_CHANGES'
  | 'CREATE'
  | 'UPDATE'
  | 'REMOVE';

export interface WorkflowStoreAdapterEvent {
  type: WorkflowStoreAdapterEventType;
  key: string;
  value: any;
}

export type UnsubscribeFn = () => void;

export interface WorkflowStoreAdapterEventSubscriberFn<
  T extends WorkflowStoreAdapterEventType,
> {
  (event: T extends 'ALL_CHANGES' ? WorkflowStoreAdapterEvent : T): void;
}

export abstract class StoreAdapter {
  abstract subscribe<U extends WorkflowStoreAdapterEventType, T extends U[]>(
    eventType: T,
    callback: WorkflowStoreAdapterEventSubscriberFn<T[number]>,
  ): UnsubscribeFn;

  /**
   * Returns the current time on the store server in milliseconds
   */
  abstract timeMS(): Promise<number>;

  /**
   * Adds an item to a scored list of items.
   * @param key - The key of the scored list
   * @param value - The value to add
   * @param score - The score to add the item at
   */
  abstract addScored(key: string, value: string, score: number): Promise<void>;

  /**
   * Adds an item to a scored list of items.
   * @param key - The key of the scored list
   * @param values - The values to add
   * @param score - The score to add the item at
   */
  abstract addScoredMany(
    key: string,
    values: string[],
    score: number,
  ): Promise<void>;

  /**
   * Removes an item from a scored list of items.
   * @param key - The key of the ordered list
   * @param value - The value to remove
   */
  abstract removeScored(key: string, value: string): Promise<void>;

  /**
   * Removes multiple items from a scored list of items.
   * @param key - The key of the ordered list
   * @param values - The values to remove
   */
  abstract removeScoredMany(key: string, values: string[]): Promise<void>;

  /**
   * Removes all items from a scored list of items up to a given score value.
   * @param key - The key of the scored list
   */
  abstract removeScoredUpTo(key: string, range: ScoreRange): Promise<void>;

  /**
   * Gets items from a scored list of items.
   * @param key - The key of the scored list
   * @param range - The range of scores to get items from
   */
  abstract getScored(key: string, range: ScoreRange): Promise<string[]>;

  /**
   * Removes a value.
   * @param key - The key of the value
   */
  abstract remove(key: string): Promise<void>;

  /**
   * Removes multiple values.
   * @param keys - The keys of the values
   */
  abstract removeMany(keys: string[]): Promise<void>;

  abstract keysGenerator(pattern: string): AsyncGenerator<string, void, any>;

  /**
   * Run a function with a lock.
   *
   * @param key - The key to lock
   * @param fn - The function to run with the lock
   */
  abstract withLock<T extends (store: this) => Promise<any>>(
    pattern: string,
    fn: T,
  ): Promise<ReturnType<T>>;

  /**
   * Set a value, unsafe.
   *
   * @param key - The key to set
   * @param value - The value to set
   */
  abstract set<T>(key: string, value: T): Promise<T>;

  /**
   * Set multiple values, unsafe.
   *
   * @param kvPairs - The key-value pairs to set
   */
  abstract setMany<T>(kvPairs: [string, T][]): Promise<void>;

  /**
   * Get a value.
   *
   * @param key - The key to get
   * @returns The value
   */
  abstract get<T>(key: string): Promise<T | null>;

  /**
   * Get multiple values.
   *
   * @param keys - The keys to get
   * @returns The values
   */
  abstract getMany<T>(keys: string[]): Promise<T[]>;

  protected toHiResScore(score: number) {
    return score * 1000;
  }
}

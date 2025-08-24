import { CASMaxRetriesReachedError, CASVersionMismatchError } from './Error';

const MAX_RETRIES = 10;
const EMPTY_VALUE = '__EMPTY__' as const;

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

export abstract class WorkflowStoreAdapter {
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
   * Removes an item from a scored list of items.
   * @param key - The key of the ordered list
   * @param value - The value to remove
   */
  abstract removeScored(key: string, value: string): Promise<void>;

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
   * Compare and set value, if the version is correct.
   *
   * @param key - The key to set
   * @param valueFactory - The value to set
   * @param expectedVersion - The expected version
   *
   * @throws VersionMismatchError if the version is incorrect
   */
  async cas<T extends { version: number }>(
    key: string,
    valueFactory: (data: T | null) => Promise<T> | T,
  ): Promise<T> {
    // __EMPTY__ instead of null to guard against the case where null is an expected value
    let result: T | typeof EMPTY_VALUE = EMPTY_VALUE;

    // loop instead of recursion to avoid stack overflow and optimize memory usage

    let value: T;
    let currentVersion: number;
    let expectedVersion: number;
    let retries = 0;

    while (result === EMPTY_VALUE && retries < MAX_RETRIES) {
      value = await valueFactory(await this.get<T>(key));

      result = await this.transaction(async tx => {
        expectedVersion = value.version;
        currentVersion = await tx.getVersion(key);

        if (currentVersion !== expectedVersion) {
          throw new CASVersionMismatchError(
            key,
            expectedVersion,
            currentVersion,
          );
        }

        return await tx.set(key, { ...value, version: expectedVersion + 1 });
      }).catch((e): typeof EMPTY_VALUE => {
        if (!(e instanceof CASVersionMismatchError)) throw e;
        return EMPTY_VALUE;
      });

      if (result !== EMPTY_VALUE) return result;

      retries++;
    }

    throw new CASMaxRetriesReachedError(
      key,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value!.version,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      currentVersion!,
      retries,
    );
  }

  abstract remove(key: string): Promise<void>;

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
   * Run a transaction.
   *
   * @param fn - The function to run in the transaction
   */
  abstract transaction<T extends (tx: this) => Promise<any>>(
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
   * Get a value.
   *
   * @param key - The key to get
   * @returns The value
   */
  abstract get<T>(key: string): Promise<T | null>;

  /**
   * Get the version by a key.
   * If the key does not exist, create it and return 0.
   *
   * @param key - The key to get the version of
   * @returns The version
   */
  abstract getVersion(key: string): Promise<number>;
}

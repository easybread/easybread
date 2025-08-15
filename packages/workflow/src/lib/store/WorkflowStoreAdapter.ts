import { CASMaxRetriesReachedError, CASVersionMismatchError } from '../Error';

const MAX_RETRIES = 10;
const EMPTY_VALUE = '__EMPTY__' as const;

export abstract class WorkflowStoreAdapter {
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

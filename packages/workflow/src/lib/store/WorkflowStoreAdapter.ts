import { VersionMismatchError } from '../Error';

export abstract class WorkflowStoreAdapter {
  /**
   * Compare and set value, if the version is correct.
   *
   * @param key - The key to set
   * @param value - The value to set
   * @param expectedVersion - The expected version
   *
   * @throws VersionMismatchError if the version is incorrect
   */
  async cas<T extends { version: number }>(key: string, value: T): Promise<T> {
    return await this.transaction(async tx => {
      const expectedVersion = value.version;
      const currentVersion = await tx.getVersion(key);

      if (currentVersion !== expectedVersion) {
        throw new VersionMismatchError(key, expectedVersion, currentVersion);
      }

      return await tx.set(key, { ...value, version: expectedVersion + 1 });
    });
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

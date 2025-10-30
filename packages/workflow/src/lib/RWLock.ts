import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

export const LOCK_TYPE = enumSuiteObject(enumObject(['READ', 'WRITE']));
export type LockType = typeof LOCK_TYPE.$type;
export interface LockObject {
  type: LockType;
  pattern: string;
}

export abstract class PatternRwLock {
  async usingWriteLock<T extends () => any>(
    pattern: string,
    fn: T,
  ): Promise<Awaited<ReturnType<T>>> {
    const lock = await this.acquireWrite(pattern);
    return this.using(lock, fn);
  }

  async usingReadLock<T extends () => any>(
    pattern: string,
    fn: T,
  ): Promise<Awaited<ReturnType<T>>> {
    const lock = await this.acquireRead(pattern);
    return this.using(lock, fn);
  }

  private async using<T extends () => any>(
    lock: LockObject,
    fn: T,
  ): Promise<Awaited<ReturnType<T>>> {
    try {
      return await fn();
    } finally {
      await this.release(lock);
    }
  }

  abstract acquireRead(pattern: string): Promise<LockObject>;
  abstract acquireWrite(pattern: string): Promise<LockObject>;
  abstract release(lock: LockObject): Promise<void>;
}

// interface PendingLock {
//   pattern: string;
//   type: 'read' | 'write';
//   resolve: () => void;
// }

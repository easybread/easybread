interface PatternRwLock {
  readLock(pattern: string): Promise<void>;
  writeLock(pattern: string): Promise<void>;
  readUnlock(pattern: string): void;
  writeUnlock(pattern: string): void;
}

interface PendingLock {
  pattern: string;
  type: 'read' | 'write';
  resolve: () => void;
}

export class HierarchicalRwLock implements PatternRwLock {
  private readLocks = new Map<string, number>(); // pattern -> count
  private writeLocks = new Set<string>(); // active write patterns
  private waitQueue: PendingLock[] = [];

  /**
   * Normalize pattern by removing redundant wildcards
   * EVENT:*:* -> EVENT:*
   * EVENT:CLOSED:*:* -> EVENT:CLOSED:*
   */
  private normalizePattern(pattern: string): string {
    const parts = pattern.split(':');
    const normalized: string[] = [];
    let hasWildcard = false;

    for (const part of parts) {
      if (part === '*') {
        if (!hasWildcard) {
          normalized.push(part);
          hasWildcard = true;
        }
        // Skip additional wildcards at the end
      } else {
        normalized.push(part);
        hasWildcard = false;
      }
    }

    return normalized.join(':');
  }

  /**
   * Check if two patterns overlap using Redis-style matching
   * FOO:* overlaps FOO:BAR:BAZ
   * FOO:*:BAR:* overlaps FOO:MIDDLE:BAR:EXTRA
   * FOO:*:BAR doesn't overlap FOO:MIDDLE:BAR:EXTRA
   */
  private patternsOverlap(pattern1: string, pattern2: string): boolean {
    const parts1 = pattern1.split(':');
    const parts2 = pattern2.split(':');

    return this.matchParts(parts1, parts2, 0, 0);
  }

  private matchParts(
    parts1: string[],
    parts2: string[],
    i1: number,
    i2: number,
  ): boolean {
    // Both patterns exhausted - match
    if (i1 >= parts1.length && i2 >= parts2.length) return true;

    // One pattern exhausted
    if (i1 >= parts1.length) {
      // pattern1 exhausted, pattern2 has more parts
      // Only matches if pattern1 ended with wildcard
      return i1 > 0 && parts1[i1 - 1] === '*';
    }
    if (i2 >= parts2.length) {
      // pattern2 exhausted, pattern1 has more parts
      // Only matches if pattern2 ended with wildcard
      return i2 > 0 && parts2[i2 - 1] === '*';
    }

    const p1 = parts1[i1];
    const p2 = parts2[i2];

    if (p1 === '*') {
      // Wildcard in pattern1 - try matching 0 or more segments
      // Try consuming 0 segments from pattern2
      if (this.matchParts(parts1, parts2, i1 + 1, i2)) return true;
      // Try consuming 1 segment from pattern2
      if (this.matchParts(parts1, parts2, i1, i2 + 1)) return true;
      return false;
    }

    if (p2 === '*') {
      // Wildcard in pattern2 - try matching 0 or more segments
      // Try consuming 0 segments from pattern1
      if (this.matchParts(parts1, parts2, i1, i2 + 1)) return true;
      // Try consuming 1 segment from pattern1
      if (this.matchParts(parts1, parts2, i1 + 1, i2)) return true;
      return false;
    }

    // Both are concrete parts - must match exactly
    if (p1 === p2) {
      return this.matchParts(parts1, parts2, i1 + 1, i2 + 1);
    }

    return false;
  }

  /**
   * Check if acquiring a lock on pattern would conflict with existing locks
   */
  private hasConflicts(pattern: string, lockType: 'read' | 'write'): boolean {
    const normalized = this.normalizePattern(pattern);

    // Write locks always conflict with everything
    if (lockType === 'write') {
      // Check against existing write locks
      for (const writePattern of this.writeLocks) {
        if (this.patternsOverlap(normalized, writePattern)) return true;
      }

      // Check against existing read locks
      for (const [readPattern] of this.readLocks) {
        if (this.patternsOverlap(normalized, readPattern)) return true;
      }

      return false;
    }

    // Read locks only conflict with write locks
    for (const writePattern of this.writeLocks) {
      if (this.patternsOverlap(normalized, writePattern)) return true;
    }

    return false;
  }

  /**
   * Add lock request to wait queue
   */
  private enqueueAndWait(
    pattern: string,
    type: 'read' | 'write',
  ): Promise<void> {
    return new Promise<void>(resolve => {
      this.waitQueue.push({ pattern, type, resolve });
    });
  }

  /**
   * Process wait queue and wake up non-conflicting locks
   */
  private processWaitQueue(): void {
    const toRemove: number[] = [];

    for (let i = 0; i < this.waitQueue.length; i++) {
      const pending = this.waitQueue[i];

      if (!this.hasConflicts(pending.pattern, pending.type)) {
        // Can acquire lock now
        const normalized = this.normalizePattern(pending.pattern);

        if (pending.type === 'write') {
          this.writeLocks.add(normalized);
        } else {
          const count = this.readLocks.get(normalized) || 0;
          this.readLocks.set(normalized, count + 1);
        }

        pending.resolve();
        toRemove.push(i);
      }
    }

    // Remove processed items (reverse order to maintain indices)
    for (let i = toRemove.length - 1; i >= 0; i--) {
      this.waitQueue.splice(toRemove[i], 1);
    }
  }

  async readLock(pattern: string): Promise<void> {
    const normalized = this.normalizePattern(pattern);

    if (this.hasConflicts(normalized, 'read')) {
      return this.enqueueAndWait(normalized, 'read');
    }

    const count = this.readLocks.get(normalized) || 0;
    this.readLocks.set(normalized, count + 1);
  }

  async writeLock(pattern: string): Promise<void> {
    const normalized = this.normalizePattern(pattern);

    if (this.hasConflicts(normalized, 'write')) {
      return this.enqueueAndWait(normalized, 'write');
    }

    this.writeLocks.add(normalized);
  }

  readUnlock(pattern: string): void {
    const normalized = this.normalizePattern(pattern);
    const count = this.readLocks.get(normalized);

    if (!count) {
      throw new Error(`No read lock held for pattern: ${pattern}`);
    }

    if (count === 1) {
      this.readLocks.delete(normalized);
    } else {
      this.readLocks.set(normalized, count - 1);
    }

    // Process wait queue after releasing lock
    this.processWaitQueue();
  }

  writeUnlock(pattern: string): void {
    const normalized = this.normalizePattern(pattern);

    if (!this.writeLocks.has(normalized)) {
      throw new Error(`No write lock held for pattern: ${pattern}`);
    }

    this.writeLocks.delete(normalized);

    // Process wait queue after releasing lock
    this.processWaitQueue();
  }

  /**
   * Get current lock status for debugging
   */
  getStatus() {
    return {
      readLocks: Object.fromEntries(this.readLocks),
      writeLocks: Array.from(this.writeLocks),
      waitQueue: this.waitQueue.map(p => ({
        pattern: p.pattern,
        type: p.type,
      })),
    };
  }
}

// Usage example:
/*
const lock = new HierarchicalRwLock();

// Multiple readers can coexist
await lock.readLock('EVENT:CLOSED:root/paginate/cmd:-/1/-');
await lock.readLock('EVENT:CLOSED:root/paginate/cmd:-/1/-'); 

// This will block until read locks are released
await lock.writeLock('EVENT:CLOSED:*');

// This will block because it overlaps with write lock above
await lock.readLock('EVENT:CLOSED:root/other/path');
*/

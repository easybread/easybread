import { InMemoryPatternRwLock } from './RWLock';

describe('HierarchicalRwLock', () => {
  let lock: InMemoryPatternRwLock;

  beforeEach(() => {
    lock = new InMemoryPatternRwLock();
  });

  describe('pattern normalization', () => {
    it('should normalize redundant wildcards', () => {
      const lock = new InMemoryPatternRwLock();

      expect(lock.normalizePattern('EVENT:*:*')).toBe('EVENT:*');
      expect(lock.normalizePattern('EVENT:CLOSED:*:*')).toBe('EVENT:CLOSED:*');
      expect(lock.normalizePattern('FOO:*:*:BAR')).toBe('FOO:*:BAR');
      expect(lock.normalizePattern('FOO:BAR')).toBe('FOO:BAR');
      expect(lock.normalizePattern('*:*:*')).toBe('*');
    });
  });

  describe('pattern overlap detection', () => {
    it('should detect overlapping patterns', () => {
      const lock = new InMemoryPatternRwLock();

      // Basic wildcard matching
      expect(lock.patternsOverlap('FOO:*', 'FOO:BAR')).toBe(true);
      expect(lock.patternsOverlap('FOO:*', 'FOO:BAR:BAZ')).toBe(true);
      expect(lock.patternsOverlap('FOO:*:BAR', 'FOO:MIDDLE:BAR')).toBe(true);

      // No overlap
      expect(lock.patternsOverlap('FOO:BAR', 'FOO:BAZ')).toBe(false);
      expect(lock.patternsOverlap('FOO:*:BAR', 'FOO:MIDDLE:BAR:EXTRA')).toBe(
        false,
      );

      // Exact matches
      expect(lock.patternsOverlap('FOO:BAR', 'FOO:BAR')).toBe(true);

      // Wildcard at end
      expect(lock.patternsOverlap('FOO:*', 'FOO:BAR:BAZ:EXTRA')).toBe(true);
      expect(lock.patternsOverlap('FOO:BAR:*', 'FOO:BAR')).toBe(false);
    });
  });

  describe('readLock', () => {
    it('should acquire read lock immediately when no conflicts', async () => {
      await lock.readLock('EVENT:CLOSED:path');

      const status = lock.getStatus();
      expect(status.readLocks['EVENT:CLOSED:path']).toBe(1);
    });

    it('should allow multiple read locks on same pattern', async () => {
      await lock.readLock('EVENT:CLOSED:path');
      await lock.readLock('EVENT:CLOSED:path');

      const status = lock.getStatus();
      expect(status.readLocks['EVENT:CLOSED:path']).toBe(2);
    });

    it('should allow multiple read locks on different patterns', async () => {
      await lock.readLock('EVENT:CLOSED:path1');
      await lock.readLock('EVENT:CLOSED:path2');

      const status = lock.getStatus();
      expect(status.readLocks['EVENT:CLOSED:path1']).toBe(1);
      expect(status.readLocks['EVENT:CLOSED:path2']).toBe(1);
    });

    it('should block read lock when write lock exists on overlapping pattern', async () => {
      await lock.writeLock('EVENT:CLOSED:*');

      const readPromise = lock.readLock('EVENT:CLOSED:specific');

      // Should be blocked
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(lock.getStatus().waitQueue).toHaveLength(1);

      // Release write lock
      lock.writeUnlock('EVENT:CLOSED:*');

      // Read lock should now be acquired
      await readPromise;
      expect(lock.getStatus().readLocks['EVENT:CLOSED:specific']).toBe(1);
    });
  });

  describe('writeLock', () => {
    it('should acquire write lock immediately when no conflicts', async () => {
      await lock.writeLock('EVENT:CLOSED:path');

      const status = lock.getStatus();
      expect(status.writeLocks).toContain('EVENT:CLOSED:path');
    });

    it('should block write lock when read locks exist on overlapping pattern', async () => {
      await lock.readLock('EVENT:CLOSED:specific');

      const writePromise = lock.writeLock('EVENT:CLOSED:*');

      // Should be blocked
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(lock.getStatus().waitQueue).toHaveLength(1);

      // Release read lock
      lock.readUnlock('EVENT:CLOSED:specific');

      // Write lock should now be acquired
      await writePromise;
      expect(lock.getStatus().writeLocks).toContain('EVENT:CLOSED:*');
    });

    it('should block write lock when another write lock exists on overlapping pattern', async () => {
      await lock.writeLock('EVENT:CLOSED:*');

      const writePromise = lock.writeLock('EVENT:CLOSED:specific');

      // Should be blocked
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(lock.getStatus().waitQueue).toHaveLength(1);

      // Release first write lock
      lock.writeUnlock('EVENT:CLOSED:*');

      // Second write lock should now be acquired
      await writePromise;
      expect(lock.getStatus().writeLocks).toContain('EVENT:CLOSED:specific');
    });
  });

  describe('readUnlock', () => {
    it('should decrement read lock count', async () => {
      await lock.readLock('EVENT:CLOSED:path');
      await lock.readLock('EVENT:CLOSED:path');

      lock.readUnlock('EVENT:CLOSED:path');

      const status = lock.getStatus();
      expect(status.readLocks['EVENT:CLOSED:path']).toBe(1);
    });

    it('should remove read lock when count reaches zero', async () => {
      await lock.readLock('EVENT:CLOSED:path');

      lock.readUnlock('EVENT:CLOSED:path');

      const status = lock.getStatus();
      expect(status.readLocks['EVENT:CLOSED:path']).toBeUndefined();
    });

    it('should throw error when unlocking non-existent read lock', () => {
      expect(() => lock.readUnlock('EVENT:CLOSED:path')).toThrow(
        'No read lock held for pattern: EVENT:CLOSED:path',
      );
    });

    it('should process wait queue after unlocking', async () => {
      await lock.readLock('EVENT:CLOSED:path');

      const writePromise = lock.writeLock('EVENT:CLOSED:*');

      // Write lock should be blocked
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(lock.getStatus().waitQueue).toHaveLength(1);

      // Unlock read lock
      lock.readUnlock('EVENT:CLOSED:path');

      // Write lock should now be acquired
      await writePromise;
      expect(lock.getStatus().writeLocks).toContain('EVENT:CLOSED:*');
      expect(lock.getStatus().waitQueue).toHaveLength(0);
    });
  });

  describe('writeUnlock', () => {
    it('should remove write lock', async () => {
      await lock.writeLock('EVENT:CLOSED:path');

      lock.writeUnlock('EVENT:CLOSED:path');

      const status = lock.getStatus();
      expect(status.writeLocks).not.toContain('EVENT:CLOSED:path');
    });

    it('should throw error when unlocking non-existent write lock', () => {
      expect(() => lock.writeUnlock('EVENT:CLOSED:path')).toThrow(
        'No write lock held for pattern: EVENT:CLOSED:path',
      );
    });

    it('should process wait queue after unlocking', async () => {
      await lock.writeLock('EVENT:CLOSED:*');

      const readPromise = lock.readLock('EVENT:CLOSED:specific');

      // Read lock should be blocked
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(lock.getStatus().waitQueue).toHaveLength(1);

      // Unlock write lock
      lock.writeUnlock('EVENT:CLOSED:*');

      // Read lock should now be acquired
      await readPromise;
      expect(lock.getStatus().readLocks['EVENT:CLOSED:specific']).toBe(1);
      expect(lock.getStatus().waitQueue).toHaveLength(0);
    });
  });

  describe('concurrent access scenarios', () => {
    it('should handle multiple concurrent read locks', async () => {
      const promises = Array.from({ length: 5 }, () =>
        lock.readLock('EVENT:CLOSED:path'),
      );

      await Promise.all(promises);

      const status = lock.getStatus();
      expect(status.readLocks['EVENT:CLOSED:path']).toBe(5);
    });

    it('should handle read-write-read sequence correctly', async () => {
      // First read lock
      await lock.readLock('EVENT:CLOSED:path1');

      // Write lock (should block)
      const writePromise = lock.writeLock('EVENT:CLOSED:*');

      // Wait a bit for the write lock to be queued
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(lock.getStatus().waitQueue).toHaveLength(1);

      // Release first read lock
      lock.readUnlock('EVENT:CLOSED:path1');

      // Write lock should be acquired
      await writePromise;
      expect(lock.getStatus().writeLocks).toContain('EVENT:CLOSED:*');

      // Now try to acquire a read lock (should block because write lock exists)
      const readPromise = lock.readLock('EVENT:CLOSED:path2');

      // Wait a bit for the read lock to be queued
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(lock.getStatus().waitQueue).toHaveLength(1);

      // Release write lock
      lock.writeUnlock('EVENT:CLOSED:*');

      // Read lock should now be acquired
      await readPromise;
      expect(lock.getStatus().readLocks['EVENT:CLOSED:path2']).toBe(1);
    });

    it('should handle complex pattern hierarchies', async () => {
      // Lock on specific path
      await lock.readLock('EVENT:CLOSED:root/paginate/cmd:-/1/-');

      // Try to write lock on wildcard (should block)
      const writePromise = lock.writeLock('EVENT:CLOSED:*');

      await new Promise(resolve => setTimeout(resolve, 10));
      expect(lock.getStatus().waitQueue).toHaveLength(1);

      // Release read lock
      lock.readUnlock('EVENT:CLOSED:root/paginate/cmd:-/1/-');

      // Write lock should now be acquired
      await writePromise;
      expect(lock.getStatus().writeLocks).toContain('EVENT:CLOSED:*');
    });
  });

  describe('getStatus', () => {
    it('should return current lock status', async () => {
      await lock.readLock('EVENT:CLOSED:path1');
      await lock.readLock('EVENT:CLOSED:path1');
      await lock.readLock('EVENT:CLOSED:path2');
      await lock.writeLock('EVENT:CLOSED:write');

      const status = lock.getStatus();

      expect(status.readLocks).toEqual({
        'EVENT:CLOSED:path1': 2,
        'EVENT:CLOSED:path2': 1,
      });
      expect(status.writeLocks).toContain('EVENT:CLOSED:write');
      expect(status.waitQueue).toHaveLength(0);
    });

    it('should show pending locks in wait queue', async () => {
      await lock.writeLock('EVENT:CLOSED:*');

      const readPromise = lock.readLock('EVENT:CLOSED:specific');

      await new Promise(resolve => setTimeout(resolve, 10));

      const status = lock.getStatus();
      expect(status.waitQueue).toHaveLength(1);
      expect(status.waitQueue[0]).toEqual({
        pattern: 'EVENT:CLOSED:specific',
        type: 'read',
      });

      // Clean up
      lock.writeUnlock('EVENT:CLOSED:*');
      await readPromise;
    });
  });

  describe('edge cases', () => {
    it('should handle empty patterns', async () => {
      await lock.readLock('');
      expect(lock.getStatus().readLocks['']).toBe(1);

      lock.readUnlock('');
      expect(lock.getStatus().readLocks['']).toBeUndefined();
    });

    it('should handle patterns with only wildcards', async () => {
      await lock.readLock('*');
      expect(lock.getStatus().readLocks['*']).toBe(1);

      lock.readUnlock('*');
      expect(lock.getStatus().readLocks['*']).toBeUndefined();
    });

    it('should handle patterns with multiple consecutive wildcards', async () => {
      const lock = new InMemoryPatternRwLock() as any;
      expect(lock.normalizePattern('FOO:*:*:*')).toBe('FOO:*');
    });

    it('should handle unlock on non-normalized pattern', async () => {
      await lock.readLock('EVENT:*:*');

      // Should work with non-normalized pattern
      lock.readUnlock('EVENT:*:*');

      const status = lock.getStatus();
      expect(status.readLocks['EVENT:*']).toBeUndefined();
    });
  });

  describe('performance and stress testing', () => {
    it('should handle many concurrent locks efficiently', async () => {
      const numLocks = 100;
      const promises = Array.from({ length: numLocks }, (_, i) =>
        lock.readLock(`EVENT:CLOSED:path${i}`),
      );

      const start = Date.now();
      await Promise.all(promises);
      const duration = Date.now() - start;

      // Should complete quickly (under 100ms)
      expect(duration).toBeLessThan(100);

      const status = lock.getStatus();
      expect(Object.keys(status.readLocks)).toHaveLength(numLocks);

      // Clean up
      for (let i = 0; i < numLocks; i++) {
        lock.readUnlock(`EVENT:CLOSED:path${i}`);
      }
    });

    it('should handle rapid lock/unlock cycles', async () => {
      const cycles = 50;

      for (let i = 0; i < cycles; i++) {
        await lock.readLock('EVENT:CLOSED:path');
        lock.readUnlock('EVENT:CLOSED:path');
      }

      const status = lock.getStatus();
      expect(status.readLocks['EVENT:CLOSED:path']).toBeUndefined();
      expect(status.waitQueue).toHaveLength(0);
    });
  });
});

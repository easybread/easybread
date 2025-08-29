import { HierarchicalKey } from './HierarchicalKey';
import { HierarchicalPattern } from './HierarchicalPattern';
import { HierarchicalUtils, PatternIndex } from './HierarchicalUtils';

describe('HierarchicalUtils', () => {
  const keys = [
    HierarchicalKey.fromString('exec1:FIBER_CLOSED:root:paginate'),
    HierarchicalKey.fromString('exec1:FIBER_OPENED:root:paginate'),
    HierarchicalKey.fromString('exec1:NODE_EXECUTED:root:transform'),
    HierarchicalKey.fromString('exec2:FIBER_CLOSED:admin:users'),
    HierarchicalKey.fromString('exec2:FIBER_OPENED:admin:users'),
  ];

  const patterns = [
    HierarchicalPattern.fromString('exec1:*:root:*'),
    HierarchicalPattern.fromString('exec2:*:admin:*'),
    HierarchicalPattern.fromString('*:FIBER_CLOSED:*'),
    HierarchicalPattern.fromString('exec1:NODE_EXECUTED:*'),
  ];

  describe('matching operations', () => {
    it('should check if key matches any pattern', () => {
      expect(HierarchicalUtils.matchesAny(keys[0], patterns)).toBe(true); // matches multiple patterns
      expect(HierarchicalUtils.matchesAny(keys[2], patterns)).toBe(true); // matches NODE_EXECUTED pattern

      const unmatchedKey = HierarchicalKey.fromString('exec3:OTHER:path');
      expect(HierarchicalUtils.matchesAny(unmatchedKey, patterns)).toBe(false);
    });

    it('should check if pattern overlaps with any pattern', () => {
      const newPattern = HierarchicalPattern.fromString(
        'exec3:OTHER:different',
      );
      expect(HierarchicalUtils.overlapsWithAny(newPattern, patterns)).toBe(
        false,
      );

      const overlappingPattern = HierarchicalPattern.fromString(
        'exec1:FIBER_CLOSED:*',
      );
      expect(
        HierarchicalUtils.overlapsWithAny(overlappingPattern, patterns),
      ).toBe(true);
    });

    it('should filter matching keys', () => {
      const pattern = HierarchicalPattern.fromString('exec1:*:root:*');
      const matching = HierarchicalUtils.filterMatching(keys, pattern);

      expect(matching).toHaveLength(3); // exec1 keys with root
      expect(matching.map(k => k.toString())).toEqual([
        'exec1:FIBER_CLOSED:root:paginate',
        'exec1:FIBER_OPENED:root:paginate',
        'exec1:NODE_EXECUTED:root:transform',
      ]);
    });
  });

  describe('grouping operations', () => {
    it('should group keys by patterns', () => {
      const groupedKeys = HierarchicalUtils.groupByPatterns(keys, patterns);

      expect(groupedKeys.size).toBe(patterns.length);

      // Check specific groups
      const exec1RootPattern = patterns[0]; // exec1:*:root:*
      const exec1Keys = groupedKeys.get(exec1RootPattern)!;
      expect(exec1Keys).toHaveLength(3);

      const exec2AdminPattern = patterns[1]; // exec2:*:admin:*
      const exec2Keys = groupedKeys.get(exec2AdminPattern)!;
      expect(exec2Keys).toHaveLength(2);
    });
  });

  describe('specificity operations', () => {
    it('should sort patterns by specificity', () => {
      const unsortedPatterns = [
        HierarchicalPattern.fromString('*'),
        HierarchicalPattern.fromString('exec1:FIBER_CLOSED:root:paginate'),
        HierarchicalPattern.fromString('exec1:*:root'),
        HierarchicalPattern.fromString('exec1:*'),
      ];

      const sorted = HierarchicalUtils.sortBySpecificity(unsortedPatterns);
      const specificities = sorted.map(p => p.getSpecificity());

      expect(specificities).toEqual([4, 2, 1, 0]); // most specific first
    });

    it('should find most specific matching pattern', () => {
      const key = HierarchicalKey.fromString(
        'exec1:FIBER_CLOSED:root:paginate',
      );
      const testPatterns = [
        HierarchicalPattern.fromString('*'),
        HierarchicalPattern.fromString('exec1:*'),
        HierarchicalPattern.fromString('exec1:FIBER_CLOSED:*'),
        HierarchicalPattern.fromString('exec1:*:root:*'),
      ];

      const mostSpecific = HierarchicalUtils.findMostSpecific(
        key,
        testPatterns,
      );
      expect(mostSpecific?.toString()).toBe('exec1:FIBER_CLOSED:*');
    });

    it('should return null when no patterns match', () => {
      const key = HierarchicalKey.fromString('unmatched:key');
      const mostSpecific = HierarchicalUtils.findMostSpecific(key, patterns);
      expect(mostSpecific).toBeNull();
    });
  });

  describe('pattern creation', () => {
    it('should create minimal pattern from keys', () => {
      const similarKeys = [
        HierarchicalKey.fromString('exec1:FIBER_CLOSED:root:paginate'),
        HierarchicalKey.fromString('exec1:FIBER_OPENED:root:paginate'),
        HierarchicalKey.fromString('exec1:NODE_EXECUTED:root:paginate'),
      ];

      const pattern = HierarchicalUtils.createMinimalPattern(similarKeys);
      expect(pattern?.toString()).toBe('exec1:*:root:paginate');
    });

    it('should handle single key', () => {
      const pattern = HierarchicalUtils.createMinimalPattern([keys[0]]);
      expect(pattern?.toString()).toBe(keys[0].toString());
    });

    it('should handle empty array', () => {
      const pattern = HierarchicalUtils.createMinimalPattern([]);
      expect(pattern).toBeNull();
    });

    it('should handle completely different keys', () => {
      const differentKeys = [
        HierarchicalKey.fromString('exec1:FIBER:root'),
        HierarchicalKey.fromString('exec2:NODE:admin'),
        HierarchicalKey.fromString('exec3:OTHER:user'),
      ];

      const pattern = HierarchicalUtils.createMinimalPattern(differentKeys);
      expect(pattern?.toString()).toBe('*'); // Normalized from *:*:*
    });
  });

  describe('coverage operations', () => {
    it('should check complete coverage', () => {
      const coveragePatterns = [
        HierarchicalPattern.fromString('exec1:*'),
        HierarchicalPattern.fromString('exec2:*'),
      ];

      expect(
        HierarchicalUtils.providesCompleteCoverage(keys, coveragePatterns),
      ).toBe(true);
    });

    it('should detect incomplete coverage', () => {
      const incompletePatterns = [
        HierarchicalPattern.fromString('exec1:FIBER_CLOSED:*'),
      ];

      expect(
        HierarchicalUtils.providesCompleteCoverage(keys, incompletePatterns),
      ).toBe(false);
    });

    it('should find uncovered keys', () => {
      const partialPatterns = [
        HierarchicalPattern.fromString('exec1:FIBER_CLOSED:*'),
        HierarchicalPattern.fromString('exec2:*'),
      ];

      const uncovered = HierarchicalUtils.findUncovered(keys, partialPatterns);
      expect(uncovered).toHaveLength(2); // exec1:FIBER_OPENED and exec1:NODE_EXECUTED
      expect(uncovered.map(k => k.toString())).toContain(
        'exec1:FIBER_OPENED:root:paginate',
      );
      expect(uncovered.map(k => k.toString())).toContain(
        'exec1:NODE_EXECUTED:root:transform',
      );
    });
  });

  describe('pattern expansion', () => {
    it('should expand pattern using key generator', () => {
      const pattern = HierarchicalPattern.fromString('exec1:*:root');

      const keyGenerator = (
        segmentIndex: number,
        currentSegments: string[],
      ) => {
        if (segmentIndex === 1) {
          // wildcard position
          return ['FIBER_CLOSED', 'FIBER_OPENED'];
        }
        return [];
      };

      const expanded = HierarchicalUtils.expandPattern(pattern, keyGenerator);
      expect(expanded).toHaveLength(2);
      expect(expanded.map(k => k.toString())).toEqual([
        'exec1:FIBER_CLOSED:root',
        'exec1:FIBER_OPENED:root',
      ]);
    });
  });

  describe('utility functions', () => {
    it('should parse keys from strings', () => {
      const keyStrings = ['exec1:FIBER:root', 'exec2:NODE:admin'];
      const parsedKeys = HierarchicalUtils.parseKeys(keyStrings);

      expect(parsedKeys).toHaveLength(2);
      expect(parsedKeys[0].toString()).toBe('exec1:FIBER:root');
      expect(parsedKeys[1].toString()).toBe('exec2:NODE:admin');
    });

    it('should parse patterns from strings', () => {
      const patternStrings = ['exec1:*:root', 'exec2:*'];
      const parsedPatterns = HierarchicalUtils.parsePatterns(patternStrings);

      expect(parsedPatterns).toHaveLength(2);
      expect(parsedPatterns[0].toString()).toBe('exec1:*:root');
      expect(parsedPatterns[1].toString()).toBe('exec2:*');
    });

    it('should convert keys to strings', () => {
      const keyStrings = HierarchicalUtils.keysToStrings(keys.slice(0, 2));
      expect(keyStrings).toEqual([
        'exec1:FIBER_CLOSED:root:paginate',
        'exec1:FIBER_OPENED:root:paginate',
      ]);
    });

    it('should convert patterns to strings', () => {
      const patternStrings = HierarchicalUtils.patternsToStrings(
        patterns.slice(0, 2),
      );
      expect(patternStrings).toEqual(['exec1:*:root:*', 'exec2:*:admin:*']);
    });

    it('should check pattern equivalence', () => {
      const patterns1 = [
        HierarchicalPattern.fromString('exec1:*'),
        HierarchicalPattern.fromString('exec2:*'),
      ];

      const patterns2 = [
        HierarchicalPattern.fromString('exec2:*'),
        HierarchicalPattern.fromString('exec1:*'),
      ];

      const patterns3 = [HierarchicalPattern.fromString('exec1:*')];

      expect(HierarchicalUtils.patternsEquivalent(patterns1, patterns2)).toBe(
        true,
      );
      expect(HierarchicalUtils.patternsEquivalent(patterns1, patterns3)).toBe(
        false,
      );
    });
  });
});

describe('PatternIndex', () => {
  const patterns = [
    HierarchicalPattern.fromString('exec1:FIBER_CLOSED:root:paginate'), // exact
    HierarchicalPattern.fromString('exec1:*:root:*'), // wildcard
    HierarchicalPattern.fromString('exec2:*'), // wildcard
    HierarchicalPattern.fromString('*:FIBER_CLOSED:*'), // wildcard
    HierarchicalPattern.fromString('exec2:NODE_EXECUTED:admin:users'), // exact
  ];

  let index: PatternIndex;

  beforeEach(() => {
    index = HierarchicalUtils.createPatternIndex(patterns);
  });

  describe('pattern indexing', () => {
    it('should create index with correct statistics', () => {
      const stats = index.getStats();
      expect(stats.exactPatterns).toBe(2);
      expect(stats.wildcardPatterns).toBe(3);
      expect(stats.total).toBe(5);
    });
  });

  describe('pattern matching', () => {
    it('should find exact matches first', () => {
      const key = HierarchicalKey.fromString(
        'exec1:FIBER_CLOSED:root:paginate',
      );
      const mostSpecific = index.findMostSpecific(key);

      expect(mostSpecific?.toString()).toBe('exec1:FIBER_CLOSED:root:paginate');
      expect(mostSpecific?.isExact()).toBe(true);
    });

    it('should find wildcard matches when no exact match', () => {
      const key = HierarchicalKey.fromString('exec1:FIBER_OPENED:root:other');
      const mostSpecific = index.findMostSpecific(key);

      expect(mostSpecific?.toString()).toBe('exec1:*:root:*');
    });

    it('should find all matching patterns', () => {
      const key = HierarchicalKey.fromString(
        'exec1:FIBER_CLOSED:root:paginate',
      );
      const allMatching = index.findMatching(key);

      expect(allMatching).toHaveLength(3); // exact + 2 wildcards
      expect(allMatching.map(p => p.toString())).toContain(
        'exec1:FIBER_CLOSED:root:paginate',
      );
      expect(allMatching.map(p => p.toString())).toContain('exec1:*:root:*');
      expect(allMatching.map(p => p.toString())).toContain('*:FIBER_CLOSED:*');
    });

    it('should return null when no patterns match', () => {
      const key = HierarchicalKey.fromString('exec3:OTHER:unmatched');
      const mostSpecific = index.findMostSpecific(key);

      expect(mostSpecific).toBeNull();
    });

    it('should check if any pattern matches', () => {
      const matchingKey = HierarchicalKey.fromString(
        'exec1:FIBER_CLOSED:root:paginate',
      );
      const nonMatchingKey = HierarchicalKey.fromString(
        'exec3:OTHER:unmatched',
      );

      expect(index.hasMatch(matchingKey)).toBe(true);
      expect(index.hasMatch(nonMatchingKey)).toBe(false);
    });
  });

  describe('performance considerations', () => {
    it('should prioritize exact matches for performance', () => {
      // This test verifies that exact matches are checked first
      const exactKey = HierarchicalKey.fromString(
        'exec2:NODE_EXECUTED:admin:users',
      );
      const result = index.findMostSpecific(exactKey);

      expect(result?.toString()).toBe('exec2:NODE_EXECUTED:admin:users');
      expect(result?.isExact()).toBe(true);
    });

    it('should handle large number of patterns efficiently', () => {
      const manyPatterns = Array.from({ length: 1000 }, (_, i) => {
        const isWildcard = i % 3 === 0;
        return isWildcard
          ? HierarchicalPattern.fromString(`exec${i}:*:root:*`)
          : HierarchicalPattern.fromString(`exec${i}:FIBER:root:paginate`);
      });

      const largeIndex = new PatternIndex(manyPatterns);
      const testKey = HierarchicalKey.fromString('exec500:FIBER:root:paginate');

      const start = Date.now();
      const result = largeIndex.findMostSpecific(testKey);
      const duration = Date.now() - start;

      expect(result).not.toBeNull();
      expect(duration).toBeLessThan(10); // Should be fast
    });
  });
});

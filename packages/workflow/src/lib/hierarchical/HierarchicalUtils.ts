import { HierarchicalKey } from './HierarchicalKey';
import { HierarchicalPattern } from './HierarchicalPattern';

/**
 * Utility functions for working with HierarchicalKey and HierarchicalPattern
 */
export class HierarchicalUtils {
  /**
   * Check if a key matches any of the given patterns
   */
  static matchesAny(
    key: HierarchicalKey,
    patterns: HierarchicalPattern[],
  ): boolean {
    return patterns.some(pattern => pattern.matches(key));
  }

  /**
   * Check if a pattern overlaps with any of the given patterns
   */
  static overlapsWithAny(
    pattern: HierarchicalPattern,
    patterns: HierarchicalPattern[],
  ): boolean {
    return patterns.some(other => pattern.overlaps(other));
  }

  /**
   * Filter keys that match the given pattern
   */
  static filterMatching(
    keys: HierarchicalKey[],
    pattern: HierarchicalPattern,
  ): HierarchicalKey[] {
    return keys.filter(key => pattern.matches(key));
  }

  /**
   * Group keys by pattern match
   */
  static groupByPatterns(
    keys: HierarchicalKey[],
    patterns: HierarchicalPattern[],
  ): Map<HierarchicalPattern, HierarchicalKey[]> {
    const result = new Map<HierarchicalPattern, HierarchicalKey[]>();

    // Initialize empty arrays for each pattern
    patterns.forEach(pattern => {
      result.set(pattern, []);
    });

    // Group keys by first matching pattern
    keys.forEach(key => {
      const matchingPattern = patterns.find(pattern => pattern.matches(key));
      if (matchingPattern) {
        result.get(matchingPattern)!.push(key);
      }
    });

    return result;
  }

  /**
   * Sort patterns by specificity (most specific first)
   */
  static sortBySpecificity(
    patterns: HierarchicalPattern[],
  ): HierarchicalPattern[] {
    return [...patterns].sort(
      (a, b) => b.getSpecificity() - a.getSpecificity(),
    );
  }

  /**
   * Find the most specific pattern that matches the key
   */
  static findMostSpecific(
    key: HierarchicalKey,
    patterns: HierarchicalPattern[],
  ): HierarchicalPattern | null {
    const matching = patterns.filter(pattern => pattern.matches(key));
    if (matching.length === 0) return null;

    return matching.reduce((mostSpecific, current) =>
      current.isMoreSpecificThan(mostSpecific) ? current : mostSpecific,
    );
  }

  /**
   * Check if two sets of patterns are equivalent (same coverage)
   */
  static patternsEquivalent(
    patterns1: HierarchicalPattern[],
    patterns2: HierarchicalPattern[],
  ): boolean {
    // Simple implementation - check if both sets contain the same normalized patterns
    const set1 = new Set(patterns1.map(p => p.toString()));
    const set2 = new Set(patterns2.map(p => p.toString()));

    if (set1.size !== set2.size) return false;

    for (const pattern of set1) {
      if (!set2.has(pattern)) return false;
    }

    return true;
  }

  /**
   * Create a pattern that matches all given keys with minimal wildcards
   */
  static createMinimalPattern(
    keys: HierarchicalKey[],
  ): HierarchicalPattern | null {
    if (keys.length === 0) return null;
    if (keys.length === 1) return HierarchicalPattern.fromKey(keys[0]);

    // Find the maximum length among all keys
    const maxLength = Math.max(...keys.map(key => key.getSegments().length));
    const segments: string[] = [];

    // For each position, check if all keys have the same segment
    for (let i = 0; i < maxLength; i++) {
      const segmentsAtPosition = keys
        .filter(key => key.getSegments().length > i)
        .map(key => key.getSegments()[i]);

      if (segmentsAtPosition.length === 0) {
        break; // No more segments at this position
      }

      // Check if all segments at this position are the same
      const firstSegment = segmentsAtPosition[0];
      const allMatch = segmentsAtPosition.every(
        segment => segment === firstSegment,
      );

      if (allMatch && segmentsAtPosition.length === keys.length) {
        // All keys have the same segment at this position
        segments.push(firstSegment);
      } else {
        // Keys differ at this position, use wildcard
        segments.push('*');
      }
    }

    return new HierarchicalPattern(segments);
  }

  /**
   * Expand a pattern to concrete keys using a key generator function
   */
  static expandPattern(
    pattern: HierarchicalPattern,
    keyGenerator: (segmentIndex: number, currentSegments: string[]) => string[],
  ): HierarchicalKey[] {
    const results: HierarchicalKey[] = [];
    this.expandRecursive(pattern.getSegments(), 0, [], keyGenerator, results);
    return results;
  }

  private static expandRecursive(
    patternSegments: readonly string[],
    index: number,
    currentSegments: string[],
    keyGenerator: (segmentIndex: number, currentSegments: string[]) => string[],
    results: HierarchicalKey[],
  ): void {
    if (index >= patternSegments.length) {
      results.push(new HierarchicalKey(currentSegments));
      return;
    }

    const segment = patternSegments[index];

    if (segment === '*') {
      // Generate possible segments for this wildcard position
      const possibleSegments = keyGenerator(index, currentSegments);

      for (const possibleSegment of possibleSegments) {
        this.expandRecursive(
          patternSegments,
          index + 1,
          [...currentSegments, possibleSegment],
          keyGenerator,
          results,
        );
      }
    } else {
      // Use concrete segment
      this.expandRecursive(
        patternSegments,
        index + 1,
        [...currentSegments, segment],
        keyGenerator,
        results,
      );
    }
  }

  /**
   * Check if a set of patterns provides complete coverage for a set of keys
   */
  static providesCompleteCoverage(
    keys: HierarchicalKey[],
    patterns: HierarchicalPattern[],
  ): boolean {
    return keys.every(key => patterns.some(pattern => pattern.matches(key)));
  }

  /**
   * Find keys that are not covered by any pattern
   */
  static findUncovered(
    keys: HierarchicalKey[],
    patterns: HierarchicalPattern[],
  ): HierarchicalKey[] {
    return keys.filter(key => !patterns.some(pattern => pattern.matches(key)));
  }

  /**
   * Create index for efficient pattern matching
   */
  static createPatternIndex(patterns: HierarchicalPattern[]): PatternIndex {
    return new PatternIndex(patterns);
  }

  /**
   * Parse multiple keys from string representations
   */
  static parseKeys(keyStrings: string[]): HierarchicalKey[] {
    return keyStrings.map(str => HierarchicalKey.fromString(str));
  }

  /**
   * Parse multiple patterns from string representations
   */
  static parsePatterns(patternStrings: string[]): HierarchicalPattern[] {
    return patternStrings.map(str => HierarchicalPattern.fromString(str));
  }

  /**
   * Convert keys to string array
   */
  static keysToStrings(keys: HierarchicalKey[]): string[] {
    return keys.map(key => key.toString());
  }

  /**
   * Convert patterns to string array
   */
  static patternsToStrings(patterns: HierarchicalPattern[]): string[] {
    return patterns.map(pattern => pattern.toString());
  }
}

/**
 * Index for efficient pattern matching against large numbers of patterns
 */
export class PatternIndex {
  private exactPatterns = new Map<string, HierarchicalPattern>();
  private wildcardPatterns: HierarchicalPattern[] = [];

  constructor(patterns: HierarchicalPattern[]) {
    for (const pattern of patterns) {
      if (pattern.isExact()) {
        this.exactPatterns.set(pattern.toString(), pattern);
      } else {
        this.wildcardPatterns.push(pattern);
      }
    }

    // Sort wildcard patterns by specificity for better performance
    this.wildcardPatterns = HierarchicalUtils.sortBySpecificity(
      this.wildcardPatterns,
    );
  }

  /**
   * Find all patterns that match the given key
   */
  findMatching(key: HierarchicalKey): HierarchicalPattern[] {
    const result: HierarchicalPattern[] = [];

    // Check exact match first
    const exactPattern = this.exactPatterns.get(key.toString());
    if (exactPattern) {
      result.push(exactPattern);
    }

    // Check wildcard patterns
    for (const pattern of this.wildcardPatterns) {
      if (pattern.matches(key)) {
        result.push(pattern);
      }
    }

    return result;
  }

  /**
   * Find the most specific pattern that matches the key
   */
  findMostSpecific(key: HierarchicalKey): HierarchicalPattern | null {
    // Check exact match first (most specific)
    const exactPattern = this.exactPatterns.get(key.toString());
    if (exactPattern) {
      return exactPattern;
    }

    // Check wildcard patterns (already sorted by specificity)
    for (const pattern of this.wildcardPatterns) {
      if (pattern.matches(key)) {
        return pattern;
      }
    }

    return null;
  }

  /**
   * Check if any pattern matches the key
   */
  hasMatch(key: HierarchicalKey): boolean {
    return this.findMostSpecific(key) !== null;
  }

  /**
   * Get statistics about the index
   */
  getStats(): {
    exactPatterns: number;
    wildcardPatterns: number;
    total: number;
  } {
    return {
      exactPatterns: this.exactPatterns.size,
      wildcardPatterns: this.wildcardPatterns.length,
      total: this.exactPatterns.size + this.wildcardPatterns.length,
    };
  }
}

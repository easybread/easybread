import type { HierarchicalKey } from '.';

/**
 * Represents a hierarchical pattern with wildcard support for matching keys.
 * Examples: "exec1:FIBER_CLOSED:*", "exec1:*:root/paginate/*"
 * Wildcards (*) can match one or more segments.
 */
export class HierarchicalPattern {
  /**
   * Create pattern from string representation
   */
  static fromString(pattern: string): HierarchicalPattern {
    return new HierarchicalPattern(pattern);
  }

  /**
   * Create pattern from segments array
   */
  static fromSegments(segments: string[]): HierarchicalPattern {
    return new HierarchicalPattern(segments);
  }

  /**
   * Create from JSON representation
   */
  static fromJSON(json: string): HierarchicalPattern {
    return new HierarchicalPattern(json);
  }

  private readonly segments: readonly string[];
  private readonly stringValue: string;
  private readonly normalizedStringValue: string;

  constructor(segments: string[] | string) {
    if (typeof segments === 'string') {
      this.stringValue = segments;
      this.segments = Object.freeze(segments.split(':'));
    } else {
      this.segments = Object.freeze([...segments]);
      this.stringValue = segments.join(':');
    }

    this.normalizedStringValue = this.normalize();
  }

  /**
   * Normalize pattern by removing redundant wildcards
   * Examples: "EVENT:*:*" -> "EVENT:*", "EVENT:CLOSED:*:*" -> "EVENT:CLOSED:*"
   * Preserves intra-segment wildcards like "some/star/path"
   */
  private normalize(): string {
    const normalized: string[] = [];
    let hasTrailingWildcard = false;

    for (const segment of this.segments) {
      if (segment === '*') {
        if (!hasTrailingWildcard) {
          normalized.push(segment);
          hasTrailingWildcard = true;
        }
        // Skip additional full-segment wildcards at the end
      } else {
        normalized.push(segment);
        hasTrailingWildcard = false;
      }
    }

    return normalized.join(':');
  }

  /**
   * Get all segments
   */
  getSegments(): readonly string[] {
    return this.segments;
  }

  /**
   * Get normalized string representation
   */
  toString(): string {
    return this.normalizedStringValue;
  }

  /**
   * Get original string representation (before normalization)
   */
  getOriginalString(): string {
    return this.stringValue;
  }

  /**
   * Check if this pattern matches a key
   */
  matches(key: HierarchicalKey): boolean {
    return this.matchesSegments(this.segments, key.getSegments());
  }

  /**
   * Check if this pattern overlaps with another pattern
   */
  overlaps(other: HierarchicalPattern): boolean {
    return (
      this.matchesSegments(this.segments, other.segments) ||
      this.matchesSegments(other.segments, this.segments)
    );
  }

  /**
   * Internal method to check if pattern segments match target segments
   */
  private matchesSegments(
    patternSegments: readonly string[],
    targetSegments: readonly string[],
  ): boolean {
    return this.matchParts(patternSegments, targetSegments, 0, 0);
  }

  /**
   * Check if a segment pattern matches a target segment using glob-style matching
   * Supports asterisk within segments, e.g., "some/star/wildcard" matches "some/path/wildcard"
   */
  private segmentMatches(pattern: string, target: string): boolean {
    // If pattern is just "*", it matches anything
    if (pattern === '*') return true;

    // If no wildcards in pattern, must be exact match
    if (!pattern.includes('*')) return pattern === target;

    // Handle the special case where pattern starts with "*/" and has no other wildcards
    // This should match anything ending with the text after the slash
    if (pattern.startsWith('*/') && pattern.indexOf('*', 2) === -1) {
      const suffix = pattern.substring(2); // Remove "*/"
      return target.endsWith(suffix);
    }

    // Handle the special case where pattern ends with "/*" and has no other wildcards
    // This should match anything starting with the text before the slash
    if (pattern.endsWith('/*') && pattern.indexOf('*') === pattern.length - 1) {
      const prefix = pattern.substring(0, pattern.length - 2); // Remove "/*"
      return target.startsWith(prefix);
    }

    // For more complex patterns, use regex approach
    // First, handle the special case of /*/: replace it with just * before processing
    const processedPattern = pattern.replace(/\/\*\//g, '*');

    const regexPattern = processedPattern
      .split('*')
      .map(part => this.escapeRegex(part))
      .join('.*');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(target);
  }

  /**
   * Recursive glob matching implementation (currently unused, kept for reference)
   */
  private globMatches(
    _pattern: string,
    _target: string,
    _pIndex: number,
    _tIndex: number,
  ): boolean {
    // This method is currently not used since we switched to regex-based matching
    // Keeping it for potential future use or debugging
    return false;
  }

  /**
   * Escape special regex characters except our wildcards
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Recursive pattern matching algorithm (from RWLock)
   */
  private matchParts(
    pattern: readonly string[],
    target: readonly string[],
    patternIndex: number,
    targetIndex: number,
  ): boolean {
    // Both exhausted - match
    if (patternIndex >= pattern.length && targetIndex >= target.length) {
      return true;
    }

    // Pattern exhausted, target has more parts
    if (patternIndex >= pattern.length) {
      // Only matches if pattern ended with wildcard
      return patternIndex > 0 && pattern[patternIndex - 1] === '*';
    }

    // Target exhausted, pattern has more parts
    if (targetIndex >= target.length) {
      // Only matches if target ended with wildcard
      return targetIndex > 0 && target[targetIndex - 1] === '*';
    }

    const patternSegment = pattern[patternIndex];
    const targetSegment = target[targetIndex];

    if (patternSegment === '*') {
      // Wildcard in pattern - try matching 0 or more segments
      // Try consuming 0 segments from target
      if (this.matchParts(pattern, target, patternIndex + 1, targetIndex)) {
        return true;
      }
      // Try consuming 1 segment from target
      if (this.matchParts(pattern, target, patternIndex, targetIndex + 1)) {
        return true;
      }
      return false;
    }

    if (targetSegment === '*') {
      // Wildcard in target - try matching 0 or more segments
      // Try consuming 0 segments from pattern
      if (this.matchParts(pattern, target, patternIndex, targetIndex + 1)) {
        return true;
      }
      // Try consuming 1 segment from pattern
      if (this.matchParts(pattern, target, patternIndex + 1, targetIndex)) {
        return true;
      }
      return false;
    }

    // Both are concrete segments - use segment matching (supports intra-segment wildcards)
    if (this.segmentMatches(patternSegment, targetSegment)) {
      return this.matchParts(
        pattern,
        target,
        patternIndex + 1,
        targetIndex + 1,
      );
    }

    return false;
  }

  /**
   * Check if this is a wildcard pattern (contains '*')
   */
  isWildcard(): boolean {
    return this.segments.some(segment => segment.includes('*'));
  }

  /**
   * Check if this is an exact pattern (no wildcards)
   */
  isExact(): boolean {
    return !this.isWildcard();
  }

  /**
   * Get the number of wildcard segments (from normalized pattern)
   * Counts both full-segment wildcards and intra-segment wildcards
   */
  getWildcardCount(): number {
    const normalizedSegments = this.normalizedStringValue.split(':');
    return normalizedSegments.reduce((count, segment) => {
      if (segment === '*') {
        return count + 1; // Full segment wildcard
      } else if (segment.includes('*')) {
        return count + (segment.match(/\*/g) || []).length; // Count * within segment
      }
      return count;
    }, 0);
  }

  /**
   * Get specificity score (higher = more specific)
   * Used for ordering patterns by specificity
   */
  getSpecificity(): number {
    const normalizedSegments = this.normalizedStringValue.split(':');
    return normalizedSegments.length - this.getWildcardCount();
  }

  /**
   * Check if this pattern is more specific than another
   */
  isMoreSpecificThan(other: HierarchicalPattern): boolean {
    return this.getSpecificity() > other.getSpecificity();
  }

  /**
   * Create a more general pattern by replacing a segment with wildcard
   */
  generalize(segmentIndex: number): HierarchicalPattern {
    if (segmentIndex < 0 || segmentIndex >= this.segments.length) {
      throw new Error('Invalid segment index');
    }

    const newSegments = [...this.segments];
    newSegments[segmentIndex] = '*';
    return new HierarchicalPattern(newSegments);
  }

  /**
   * Get all keys that would match this pattern up to a certain depth
   * (useful for enumeration with limited depth)
   */
  enumerateMatches(
    availableSegments: string[],
    maxDepth = 5,
  ): HierarchicalKey[] {
    const results: HierarchicalKey[] = [];
    const normalizedSegments = this.normalizedStringValue.split(':');
    this.enumerateRecursive(
      [],
      0,
      normalizedSegments,
      availableSegments,
      maxDepth,
      results,
    );
    return results;
  }

  private enumerateRecursive(
    currentSegments: string[],
    patternIndex: number,
    normalizedSegments: string[],
    availableSegments: string[],
    remainingDepth: number,
    results: HierarchicalKey[],
  ): void {
    if (patternIndex >= normalizedSegments.length) {
      results.push(new HierarchicalKey(currentSegments));
      return;
    }

    if (remainingDepth <= 0) return;

    const segment = normalizedSegments[patternIndex];

    if (segment === '*') {
      // Try all available segments for wildcard
      for (const availableSegment of availableSegments) {
        this.enumerateRecursive(
          [...currentSegments, availableSegment],
          patternIndex + 1,
          normalizedSegments,
          availableSegments,
          remainingDepth - 1,
          results,
        );
      }
    } else {
      // Use exact segment
      this.enumerateRecursive(
        [...currentSegments, segment],
        patternIndex + 1,
        normalizedSegments,
        availableSegments,
        remainingDepth - 1,
        results,
      );
    }
  }

  /**
   * Check equality with another pattern
   */
  equals(other: HierarchicalPattern): boolean {
    return this.normalizedStringValue === other.normalizedStringValue;
  }

  /**
   * Convert to JSON representation
   */
  toJSON(): string {
    return this.normalizedStringValue;
  }
}

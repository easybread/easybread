import { HierarchicalKey } from './HierarchicalKey';

/**
 * Represents a hierarchical pattern with wildcard support for matching keys.
 * Examples: "exec1:FIBER_CLOSED:*", "exec1:*:root/paginate/*"
 * Wildcards (*) can match one or more segments.
 */
export class HierarchicalPattern {
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
   * Create pattern from a key (exact match pattern)
   */
  static fromKey(key: HierarchicalKey): HierarchicalPattern {
    return new HierarchicalPattern(key.getSegments().slice());
  }

  /**
   * Builder pattern for constructing patterns
   */
  static builder(): HierarchicalPatternBuilder {
    return new HierarchicalPatternBuilder();
  }

  /**
   * Normalize pattern by removing redundant wildcards
   * Examples: "EVENT:*:*" -> "EVENT:*", "EVENT:CLOSED:*:*" -> "EVENT:CLOSED:*"
   */
  private normalize(): string {
    const normalized: string[] = [];
    let hasWildcard = false;

    for (const segment of this.segments) {
      if (segment === '*') {
        if (!hasWildcard) {
          normalized.push(segment);
          hasWildcard = true;
        }
        // Skip additional wildcards at the end
      } else {
        normalized.push(segment);
        hasWildcard = false;
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

    // Both are concrete segments - must match exactly
    if (patternSegment === targetSegment) {
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
    return this.segments.includes('*');
  }

  /**
   * Check if this is an exact pattern (no wildcards)
   */
  isExact(): boolean {
    return !this.isWildcard();
  }

  /**
   * Get the number of wildcard segments (from normalized pattern)
   */
  getWildcardCount(): number {
    return this.normalizedStringValue.split(':').filter(s => s === '*').length;
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
   * Create a more specific pattern by replacing the first wildcard with a concrete segment
   */
  specialize(segment: string): HierarchicalPattern {
    const newSegments = [...this.segments];
    const wildcardIndex = newSegments.indexOf('*');

    if (wildcardIndex === -1) {
      throw new Error('Cannot specialize pattern without wildcards');
    }

    newSegments[wildcardIndex] = segment;
    return new HierarchicalPattern(newSegments);
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

  /**
   * Create from JSON representation
   */
  static fromJSON(json: string): HierarchicalPattern {
    return new HierarchicalPattern(json);
  }
}

/**
 * Builder for constructing HierarchicalPattern instances
 */
export class HierarchicalPatternBuilder {
  private segments: string[] = [];

  /**
   * Add a concrete segment
   */
  segment(segment: string): this {
    this.segments.push(segment);
    return this;
  }

  /**
   * Add multiple segments
   */
  addSegments(...segments: string[]): this {
    this.segments.push(...segments);
    return this;
  }

  /**
   * Add a wildcard segment
   */
  wildcard(): this {
    this.segments.push('*');
    return this;
  }

  /**
   * Add segments from a path-like string (splitting by '/')
   */
  path(path: string): this {
    const pathSegments = path.split('/').filter(s => s.length > 0);
    this.segments.push(...pathSegments);
    return this;
  }

  /**
   * Add a wildcard if condition is true, otherwise add the segment
   */
  conditionalWildcard(condition: boolean, segment?: string): this {
    if (condition) {
      this.segments.push('*');
    } else if (segment !== undefined) {
      this.segments.push(segment);
    }
    return this;
  }

  /**
   * Build the pattern
   */
  build(): HierarchicalPattern {
    return new HierarchicalPattern([...this.segments]);
  }

  /**
   * Reset the builder
   */
  reset(): this {
    this.segments = [];
    return this;
  }
}

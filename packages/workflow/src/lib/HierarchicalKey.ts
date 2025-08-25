/**
 * Represents a hierarchical key composed of segments separated by colons.
 * Examples: "exec1:FIBER_CLOSED:root/paginate/cmd:-/0/-/1/-/-"
 */
export class HierarchicalKey {
  private readonly segments: readonly string[];
  private readonly stringValue: string;

  constructor(segments: string[] | string) {
    if (typeof segments === 'string') {
      this.stringValue = segments;
      this.segments = Object.freeze(segments.split(':'));
    } else {
      this.segments = Object.freeze([...segments]);
      this.stringValue = segments.join(':');
    }
  }

  /**
   * Create key from string representation
   */
  static fromString(key: string): HierarchicalKey {
    return new HierarchicalKey(key);
  }

  /**
   * Create key from segments array
   */
  static fromSegments(segments: string[]): HierarchicalKey {
    return new HierarchicalKey(segments);
  }

  /**
   * Builder pattern for constructing keys
   */
  static builder(): HierarchicalKeyBuilder {
    return new HierarchicalKeyBuilder();
  }

  /**
   * Get all segments
   */
  getSegments(): readonly string[] {
    return this.segments;
  }

  /**
   * Get segment at specific index
   */
  getSegment(index: number): string | undefined {
    return this.segments[index];
  }

  /**
   * Get number of segments
   */
  getSegmentCount(): number {
    return this.segments.length;
  }

  /**
   * Get string representation
   */
  toString(): string {
    return this.stringValue;
  }

  /**
   * Check if this key starts with given prefix key
   */
  startsWith(prefix: HierarchicalKey): boolean {
    if (prefix.segments.length > this.segments.length) {
      return false;
    }

    for (let i = 0; i < prefix.segments.length; i++) {
      if (this.segments[i] !== prefix.segments[i]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get a sub-key with segments from start to end (exclusive)
   */
  slice(start: number, end?: number): HierarchicalKey {
    return new HierarchicalKey(this.segments.slice(start, end));
  }

  /**
   * Append segments to create a new key
   */
  append(...segments: string[]): HierarchicalKey {
    return new HierarchicalKey([...this.segments, ...segments]);
  }

  /**
   * Prepend segments to create a new key
   */
  prepend(...segments: string[]): HierarchicalKey {
    return new HierarchicalKey([...segments, ...this.segments]);
  }

  /**
   * Get parent key (all segments except the last one)
   */
  getParent(): HierarchicalKey | null {
    if (this.segments.length <= 1) {
      return null;
    }
    return new HierarchicalKey(this.segments.slice(0, -1));
  }

  /**
   * Get the last segment (leaf)
   */
  getLeaf(): string | undefined {
    return this.segments[this.segments.length - 1];
  }

  /**
   * Check equality with another key
   */
  equals(other: HierarchicalKey): boolean {
    return this.stringValue === other.stringValue;
  }

  /**
   * Compare keys lexicographically
   */
  compareTo(other: HierarchicalKey): number {
    return this.stringValue.localeCompare(other.stringValue);
  }

  /**
   * Get all ancestor keys (from root to parent)
   */
  getAncestors(): HierarchicalKey[] {
    const ancestors: HierarchicalKey[] = [];
    for (let i = 1; i < this.segments.length; i++) {
      ancestors.push(new HierarchicalKey(this.segments.slice(0, i)));
    }
    return ancestors;
  }

  /**
   * Check if this key is an ancestor of the given key
   */
  isAncestorOf(other: HierarchicalKey): boolean {
    return other.startsWith(this) && !this.equals(other);
  }

  /**
   * Check if this key is a descendant of the given key
   */
  isDescendantOf(other: HierarchicalKey): boolean {
    return this.startsWith(other) && !this.equals(other);
  }

  /**
   * Get the common ancestor with another key
   */
  getCommonAncestor(other: HierarchicalKey): HierarchicalKey | null {
    const minLength = Math.min(this.segments.length, other.segments.length);
    let commonLength = 0;

    for (let i = 0; i < minLength; i++) {
      if (this.segments[i] === other.segments[i]) {
        commonLength++;
      } else {
        break;
      }
    }

    if (commonLength === 0) {
      return null;
    }

    return new HierarchicalKey(this.segments.slice(0, commonLength));
  }

  /**
   * Convert to JSON representation
   */
  toJSON(): string {
    return this.stringValue;
  }

  /**
   * Create from JSON representation
   */
  static fromJSON(json: string): HierarchicalKey {
    return new HierarchicalKey(json);
  }
}

/**
 * Builder for constructing HierarchicalKey instances
 */
export class HierarchicalKeyBuilder {
  private segments: string[] = [];

  /**
   * Add a segment
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
   * Add segments from a path-like string (splitting by '/')
   */
  path(path: string): this {
    const pathSegments = path.split('/').filter(s => s.length > 0);
    this.segments.push(...pathSegments);
    return this;
  }

  /**
   * Build the key
   */
  build(): HierarchicalKey {
    return new HierarchicalKey([...this.segments]);
  }

  /**
   * Reset the builder
   */
  reset(): this {
    this.segments = [];
    return this;
  }
}

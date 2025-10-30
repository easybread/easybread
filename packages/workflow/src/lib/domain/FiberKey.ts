export class FiberKey {
  static CHARS = {
    SEPARATOR: '/',
    PIPE: '-',
    WILDCARD: '~',
  } as const;

  path: string[];

  static fromKeyString(fiberKey: string) {
    return new this(fiberKey.split(FiberKey.CHARS.SEPARATOR));
  }

  static fromSegments(segments: string[]) {
    return new this(segments);
  }

  get lastSegment() {
    return this.path.at(-1);
  }

  protected constructor(path: string[]) {
    this.path = path;
  }

  extend(segment: string) {
    return new FiberKey([...this.path, segment]);
  }

  fork(segment: string) {
    if (this.lastSegment === segment) {
      throw new Error('FiberKey: Cannot fork on the same segment');
    }

    return new FiberKey([...this.path.slice(0, -1), segment]);
  }

  prefixFrom(index: number) {
    if (index < 0) {
      throw new Error('FiberKey: Index must be greater than 0');
    }

    return new FiberKey(this.path.slice(0, index + 1));
  }

  parentPrefixFrom(index: number) {
    if (index < 0) {
      throw new Error('FiberKey: Index must be greater than 0');
    }
    return new FiberKey(this.path.slice(0, index));
  }

  toString() {
    return this.path.join('/');
  }
}

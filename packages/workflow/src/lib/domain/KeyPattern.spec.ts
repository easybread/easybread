import { minimatch } from 'minimatch';

import { KeyPattern } from './KeyPattern';

describe('subclassing', () => {
  it('should extend with a a pre-configured pattern', () => {
    class TestPattern extends KeyPattern.forPreset('S(foo):P(bar)') {
      static make = this.createFactoryMethod(this.PATTERN_TEMPLATE);
    }
    const pattern = TestPattern.make({
      foo: 'foo',
      bar: KeyPattern.WILDCARDS.ONE_SEGMENT,
    });

    expect(pattern.templateSegments).toEqual([
      { macro: 'S', propName: 'foo' },
      { macro: 'P', propName: 'bar' },
    ]);

    expect(pattern.props).toEqual({ foo: 'foo', bar: '*' });
  });
});

describe('current internal implementation details (minimatch)', () => {
  describe('minimatch behavior', () => {
    it.each([
      ['a/b{/*/,/}c', 'a/b/x/c', true],
      ['a/b{/*/,/}c', 'a/b/c', true],
      ['a/b{/*/*/,/}c', 'a/b/c', true],

      ['a/*/*/e', 'a/b/c/e', true],
      ['a/*/*/e', 'a/b/c/d/e', false],

      ['*/a', 'x/a', true],
      ['*/a', 'x/y/a', false],

      ['a/*', 'a', false],
      ['a/*', 'a/x', true],
      ['a/*', 'a/x/y', false],

      ['a/**/e', 'a/e', true],
      ['a/**/e', 'a/x/e', true],
      ['a/**/e', 'a/x/y/e', true],
      ['a/**/e', 'a/x/y/z/e', true],
      ['a/**/e', 'x/a/b/e', false],
      ['a/**/e', 'a/b/c/x', false],
      ['a/**/e', 'x/b/c/e', false],
    ])('should match %s with %s', (pattern, key, expected) => {
      expect(minimatch(key, pattern)).toBe(expected);
    });
  });

  class TestPattern extends KeyPattern.forPreset('S(foo):P(bar):P(baz)') {
    static make = this.createFactoryMethod(this.PATTERN_TEMPLATE);
  }
  it('should not create minimatch patterns for exact patterns', () => {
    const pattern = TestPattern.make({
      foo: 'A',
      bar: 'B',
      baz: 'C',
    });
    expect(pattern.minimatchPatterns).toEqual({});
  });

  it('should not create minimatch patterns for full segment wildcards', () => {
    const pattern = TestPattern.make({
      foo: 'A',
      bar: KeyPattern.WILDCARDS.ONE_SEGMENT,
      baz: KeyPattern.WILDCARDS.ONE_SEGMENT,
    });
    expect(pattern.minimatchPatterns).toEqual({});
  });

  it('should create minimatch patterns for path segment inner wildcards', () => {
    const pattern = TestPattern.make({
      foo: 'A',
      bar: '-/~/1/*',
      baz: 'C',
    });
    expect(pattern.minimatchPatterns).toEqual({
      bar: '-/~/1/*',
    });
  });
});

describe('match()', () => {
  class TestPattern extends KeyPattern.forPreset('S(foo):P(bar):P(baz)') {
    static make = this.createFactoryMethod(this.PATTERN_TEMPLATE);
  }

  describe('exact match', () => {
    const pattern = TestPattern.make({
      foo: 'A',
      bar: 'B',
      baz: 'C',
    });
    it.each([
      ['A:B', false],
      ['B:C', false],
      ['A:B:C', true],
      ['A:B:D', false],
      ['A:B:C:D', false],
    ])('%s should return %s', (key, expected) => {
      expect(pattern.matchKey(key)).toBe(expected);
    });
  });

  describe('full segment wildcard match', () => {
    const wildcardStart = TestPattern.make({
      foo: TestPattern.WILDCARDS.ONE_SEGMENT,
      bar: 'B',
      baz: 'C',
    });

    const wildcardMiddle = TestPattern.make({
      foo: 'A',
      bar: TestPattern.WILDCARDS.ONE_SEGMENT,
      baz: 'C',
    });

    const wildcardEnd = TestPattern.make({
      foo: 'A',
      bar: 'B',
      baz: TestPattern.WILDCARDS.ONE_SEGMENT,
    });

    const wildcardMap = {
      wildcardStart,
      wildcardMiddle,
      wildcardEnd,
    } as const;

    it.each([
      ['wildcardStart', 'x:B:C', true],
      ['wildcardStart', 'B:C', false],
      ['wildcardStart', 'x:B:C:D', false],
      ['wildcardStart', 'x:B:x', false],
      ['wildcardStart', 'x:x:C', false],

      ['wildcardMiddle', 'A:x:C', true],
      ['wildcardMiddle', 'x:x:C', false],
      ['wildcardMiddle', 'A:x:x:C', false],
      ['wildcardMiddle', 'A:x:x', false],

      ['wildcardEnd', 'A:B:x', true],
      ['wildcardEnd', 'A:B:x:x', false],
    ] satisfies [keyof typeof wildcardMap, string, boolean][])(
      'for "%s", %s should return %s',
      (wildcardKey, key, expected) => {
        expect(wildcardMap[wildcardKey].matchKey(key)).toBe(expected);
      },
    );
  });

  describe('path segment inner wildcard match', () => {
    it.each([
      // check that special characters are matched correctly
      ['-/*', 'A:-/-:C', true],
      ['-/*', 'A:-/1:C', true],
      ['-/*', 'A:-/~:C', true],
      ['-/*', 'A:-:C', false],
      ['-/*', 'A:-/-/-:C', false],

      // now on, we can just use 'x' to check wildcard match like this:
      ['-/*', 'A:-/x:C', true],

      ['-/*/-', 'A:-/x/-:C', true],
      ['-/*/-', 'A:-/x/x/-:C', false],
      ['-/*/-', 'A:-/-:C', false],

      ['-/*/*/-', 'A:-/x/x/-:C', true],
      ['-/*/*/-', 'A:-/x/-:C', false],
      ['-/*/*/-', 'A:-/x/x/x/-:C', false],
    ])(
      'for path pattern "%s", and key "%s" should return %s',
      (pathPattern, key, expected) => {
        const pattern = TestPattern.make({
          foo: 'A',
          bar: pathPattern,
          baz: 'C',
        });

        expect(pattern.matchKey(key)).toBe(expected);
      },
    );
  });
});

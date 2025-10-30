import { HierarchicalKey } from './HierarchicalKey';
import { HierarchicalPattern } from './HierarchicalPattern';

describe('HierarchicalPattern', () => {
  describe('construction', () => {
    it('should create from string', () => {
      const pattern = HierarchicalPattern.fromString('exec1:FIBER_CLOSED:*');
      expect(pattern.toString()).toBe('exec1:FIBER_CLOSED:*');
      expect(pattern.getSegments()).toEqual(['exec1', 'FIBER_CLOSED', '*']);
    });

    it('should create from segments array', () => {
      const segments = ['exec1', '*', 'root'];
      const pattern = HierarchicalPattern.fromSegments(segments);
      expect(pattern.toString()).toBe('exec1:*:root');
      expect(pattern.getSegments()).toEqual(segments);
    });

    it('should create from key', () => {
      const key = HierarchicalKey.fromString('exec1:FIBER_CLOSED:root');
      const pattern = HierarchicalPattern.fromKey(key);
      expect(pattern.toString()).toBe('exec1:FIBER_CLOSED:root');
      expect(pattern.isExact()).toBe(true);
    });
  });

  describe('normalization', () => {
    it('should normalize redundant wildcards', () => {
      expect(HierarchicalPattern.fromString('EVENT:*:*').toString()).toBe(
        'EVENT:*',
      );
      expect(
        HierarchicalPattern.fromString('EVENT:CLOSED:*:*').toString(),
      ).toBe('EVENT:CLOSED:*');
      expect(HierarchicalPattern.fromString('FOO:*:*:BAR').toString()).toBe(
        'FOO:*:BAR',
      );
      expect(HierarchicalPattern.fromString('*:*:*').toString()).toBe('*');
    });

    it('should preserve original string', () => {
      const pattern = HierarchicalPattern.fromString('EVENT:*:*');
      expect(pattern.getOriginalString()).toBe('EVENT:*:*');
      expect(pattern.toString()).toBe('EVENT:*');
    });
  });

  describe('pattern matching', () => {
    it('should match exact patterns', () => {
      const pattern = HierarchicalPattern.fromString('exec1:FIBER_CLOSED:root');
      const key = HierarchicalKey.fromString('exec1:FIBER_CLOSED:root');
      const nonMatchingKey = HierarchicalKey.fromString(
        'exec1:FIBER_CLOSED:other',
      );

      expect(pattern.matches(key)).toBe(true);
      expect(pattern.matches(nonMatchingKey)).toBe(false);
    });

    it('should match wildcard patterns', () => {
      const pattern = HierarchicalPattern.fromString('exec1:*:root');

      expect(
        pattern.matches(HierarchicalKey.fromString('exec1:FIBER_CLOSED:root')),
      ).toBe(true);
      expect(
        pattern.matches(HierarchicalKey.fromString('exec1:OTHER:root')),
      ).toBe(true);
      expect(
        pattern.matches(HierarchicalKey.fromString('exec1:MIDDLE:EXTRA:root')),
      ).toBe(true);

      expect(
        pattern.matches(HierarchicalKey.fromString('exec2:FIBER_CLOSED:root')),
      ).toBe(false);
      expect(
        pattern.matches(HierarchicalKey.fromString('exec1:FIBER_CLOSED:other')),
      ).toBe(false);
    });

    it('should match trailing wildcards', () => {
      const pattern = HierarchicalPattern.fromString('exec1:FIBER_CLOSED:*');

      expect(
        pattern.matches(HierarchicalKey.fromString('exec1:FIBER_CLOSED:root')),
      ).toBe(true);
      expect(
        pattern.matches(
          HierarchicalKey.fromString('exec1:FIBER_CLOSED:root:paginate'),
        ),
      ).toBe(true);
      expect(
        pattern.matches(
          HierarchicalKey.fromString('exec1:FIBER_CLOSED:root:paginate:cmd'),
        ),
      ).toBe(true);

      expect(
        pattern.matches(HierarchicalKey.fromString('exec1:FIBER_CLOSED')),
      ).toBe(false);
      expect(
        pattern.matches(HierarchicalKey.fromString('exec2:FIBER_CLOSED:root')),
      ).toBe(false);
    });

    it('should handle complex wildcard patterns', () => {
      const pattern = HierarchicalPattern.fromString('exec1:*:root:*:cmd');

      expect(
        pattern.matches(
          HierarchicalKey.fromString('exec1:FIBER:root:paginate:cmd'),
        ),
      ).toBe(true);
      expect(
        pattern.matches(
          HierarchicalKey.fromString('exec1:FIBER:root:deep:nested:path:cmd'),
        ),
      ).toBe(true);

      expect(
        pattern.matches(
          HierarchicalKey.fromString('exec1:FIBER:other:paginate:cmd'),
        ),
      ).toBe(false);
      expect(
        pattern.matches(
          HierarchicalKey.fromString('exec1:FIBER:root:paginate:other'),
        ),
      ).toBe(false);
    });

    it('should handle intra-segment wildcards', () => {
      const pattern = HierarchicalPattern.fromString(
        'FOO:some/*/wildcard:*:NOX',
      );

      // Should match - proper segment count matching
      expect(
        pattern.matches(
          HierarchicalKey.fromString('FOO:some/wildcard:ANYTHING:NOX'),
        ),
      ).toBe(true);
      expect(
        pattern.matches(
          HierarchicalKey.fromString('FOO:some/path/wildcard:BAR:NOX'),
        ),
      ).toBe(true);
      expect(
        pattern.matches(
          HierarchicalKey.fromString('FOO:some/path/with/wildcard:BAR:NOX'),
        ),
      ).toBe(true);

      // Should not match
      expect(
        pattern.matches(
          HierarchicalKey.fromString('OTHER:some/path/wildcard:BAR:NOX'),
        ),
      ).toBe(false);
      expect(
        pattern.matches(
          HierarchicalKey.fromString('FOO:some/path/wildcard:BAR:OTHER'),
        ),
      ).toBe(false);
      expect(
        pattern.matches(
          HierarchicalKey.fromString('FOO:OTHER/path/wildcard:BAR:NOX'),
        ),
      ).toBe(false);
      expect(
        pattern.matches(
          HierarchicalKey.fromString('FOO:some/path/OTHER:BAR:NOX'),
        ),
      ).toBe(false);
      expect(
        pattern.matches(
          HierarchicalKey.fromString('some/path/wildcard:BAR:NOX'),
        ),
      ).toBe(false);
      expect(
        pattern.matches(
          HierarchicalKey.fromString('FOO:some/path/wildcard:BAR'),
        ),
      ).toBe(false);
      expect(
        pattern.matches(
          HierarchicalKey.fromString('FOO:path/wildcard:BAR:NOX'),
        ),
      ).toBe(false);
      expect(
        pattern.matches(HierarchicalKey.fromString('FOO:some/path:BAR:NOX')),
      ).toBe(false);
    });

    it('should handle your original example correctly', () => {
      const pattern = HierarchicalPattern.fromString(
        'FOO:some/*/wildcard:*:NOX',
      );

      // Based on your original requirements, these should all match
      expect(
        pattern.matches(HierarchicalKey.fromString('FOO:some/wildcard:NOX')), // * segment matches nothing
      ).toBe(true);
      expect(
        pattern.matches(
          HierarchicalKey.fromString('FOO:some/wildcard:BAR:NOX'),
        ), // * segment matches BAR
      ).toBe(true);
      expect(
        pattern.matches(
          HierarchicalKey.fromString('FOO:some/path/wildcard:BAR:NOX'),
        ), // intra-segment * matches path
      ).toBe(true);
      expect(
        pattern.matches(
          HierarchicalKey.fromString('FOO:some/long/path/wildcard:BAR:NOX'),
        ), // intra-segment * matches long/path
      ).toBe(true);

      // This should match too - * segment can match multiple segments (BAR:BAZ)
      expect(
        pattern.matches(
          HierarchicalKey.fromString('FOO:some/path/with/wildcard:BAR:BAZ:NOX'),
        ),
      ).toBe(true); // * segment matches BAR:BAZ
    });

    it('should handle simple intra-segment wildcards', () => {
      const pattern = HierarchicalPattern.fromString('some/*/wildcard');

      // Based on user requirements, * should be able to match zero characters
      expect(
        pattern.matches(HierarchicalKey.fromString('some/wildcard')), // * matches zero chars
      ).toBe(true);
      expect(
        pattern.matches(HierarchicalKey.fromString('some/path/wildcard')), // * matches "path"
      ).toBe(true);
      expect(
        pattern.matches(
          HierarchicalKey.fromString('some/long/path/to/wildcard'),
        ), // * matches "long/path/to"
      ).toBe(true);
      expect(
        pattern.matches(HierarchicalKey.fromString('some/x/wildcard')), // * matches "x"
      ).toBe(true);

      // But should NOT match these
      expect(
        pattern.matches(HierarchicalKey.fromString('some/other')), // Wrong ending
      ).toBe(false);
      expect(
        pattern.matches(HierarchicalKey.fromString('other/path/wildcard')), // Wrong beginning
      ).toBe(false);
    });

    it('should handle multiple intra-segment wildcards', () => {
      const pattern = HierarchicalPattern.fromString(
        'prefix/*/middle/*/suffix',
      );

      expect(
        pattern.matches(HierarchicalKey.fromString('prefix/a/middle/b/suffix')),
      ).toBe(true);
      expect(
        pattern.matches(
          HierarchicalKey.fromString('prefix/path/to/middle/other/path/suffix'),
        ),
      ).toBe(true);

      // With current implementation, both wildcards can match zero chars
      expect(
        pattern.matches(HierarchicalKey.fromString('prefix/middle/suffix')),
      ).toBe(true); // Both * match zero chars

      expect(
        pattern.matches(HierarchicalKey.fromString('prefix/a/other/b/suffix')),
      ).toBe(false); // Wrong middle part
    });

    it('should handle patterns with wildcards at beginning and end of segments', () => {
      const pattern = HierarchicalPattern.fromString(
        '*/suffix:prefix/*:*/both/*',
      );

      expect(
        pattern.matches(
          HierarchicalKey.fromString(
            'anything/suffix:prefix/anything:x/both/y',
          ),
        ),
      ).toBe(true);
      expect(
        pattern.matches(
          HierarchicalKey.fromString(
            'path/to/file.suffix:prefix/config.json:data/both/end',
          ),
        ),
      ).toBe(true);

      expect(
        pattern.matches(
          HierarchicalKey.fromString(
            'anything/other:prefix/anything:anything:both/anything',
          ),
        ),
      ).toBe(false);
      expect(
        pattern.matches(
          HierarchicalKey.fromString(
            'anything/suffix:other/anything:anything:both/anything',
          ),
        ),
      ).toBe(false);
    });
  });

  describe('pattern overlap detection', () => {
    it('should detect overlapping patterns', () => {
      const pattern1 = HierarchicalPattern.fromString('FOO:*');
      const pattern2 = HierarchicalPattern.fromString('FOO:BAR');
      const pattern3 = HierarchicalPattern.fromString('FOO:*:BAZ');
      const pattern4 = HierarchicalPattern.fromString('BAR:*');

      expect(pattern1.overlaps(pattern2)).toBe(true);
      expect(pattern2.overlaps(pattern1)).toBe(true);
      expect(pattern1.overlaps(pattern3)).toBe(true);
      expect(pattern1.overlaps(pattern4)).toBe(false);
    });

    it('should handle complex overlap scenarios', () => {
      const pattern1 = HierarchicalPattern.fromString('FOO:*:BAR');
      const pattern2 = HierarchicalPattern.fromString('FOO:MIDDLE:BAR');
      const pattern3 = HierarchicalPattern.fromString('FOO:MIDDLE:BAR:EXTRA');

      expect(pattern1.overlaps(pattern2)).toBe(true);
      expect(pattern1.overlaps(pattern3)).toBe(false);
    });
  });

  describe('pattern properties', () => {
    it('should identify wildcard patterns', () => {
      expect(
        HierarchicalPattern.fromString('exec1:FIBER:root').isWildcard(),
      ).toBe(false);
      expect(HierarchicalPattern.fromString('exec1:*:root').isWildcard()).toBe(
        true,
      );
      expect(HierarchicalPattern.fromString('*').isWildcard()).toBe(true);
    });

    it('should identify exact patterns', () => {
      expect(HierarchicalPattern.fromString('exec1:FIBER:root').isExact()).toBe(
        true,
      );
      expect(HierarchicalPattern.fromString('exec1:*:root').isExact()).toBe(
        false,
      );
    });

    it('should count wildcards', () => {
      expect(
        HierarchicalPattern.fromString('exec1:FIBER:root').getWildcardCount(),
      ).toBe(0);
      expect(
        HierarchicalPattern.fromString('exec1:*:root').getWildcardCount(),
      ).toBe(1);
      expect(HierarchicalPattern.fromString('*:*:*').getWildcardCount()).toBe(
        1,
      ); // normalized

      // Intra-segment wildcards
      expect(
        HierarchicalPattern.fromString('some/*/path').getWildcardCount(),
      ).toBe(1);
      expect(
        HierarchicalPattern.fromString('*/prefix:suffix/*').getWildcardCount(),
      ).toBe(2);
      expect(
        HierarchicalPattern.fromString(
          'prefix/*/middle/*/suffix',
        ).getWildcardCount(),
      ).toBe(2);
    });

    it('should calculate specificity', () => {
      expect(
        HierarchicalPattern.fromString('exec1:FIBER:root').getSpecificity(),
      ).toBe(3);
      expect(
        HierarchicalPattern.fromString('exec1:*:root').getSpecificity(),
      ).toBe(2);
      expect(HierarchicalPattern.fromString('*').getSpecificity()).toBe(0);
    });

    it('should compare specificity', () => {
      const specific = HierarchicalPattern.fromString('exec1:FIBER:root');
      const general = HierarchicalPattern.fromString('exec1:*:root');
      const veryGeneral = HierarchicalPattern.fromString('*');

      expect(specific.isMoreSpecificThan(general)).toBe(true);
      expect(general.isMoreSpecificThan(specific)).toBe(false);
      expect(general.isMoreSpecificThan(veryGeneral)).toBe(true);
    });
  });

  describe('pattern manipulation', () => {
    it('should generalize patterns', () => {
      const pattern = HierarchicalPattern.fromString('exec1:FIBER_CLOSED:root');
      const generalized = pattern.generalize(1);

      expect(generalized.toString()).toBe('exec1:*:root');
      expect(pattern.toString()).toBe('exec1:FIBER_CLOSED:root'); // original unchanged
    });

    it('should throw when generalizing with invalid index', () => {
      const pattern = HierarchicalPattern.fromString('exec1:FIBER:root');
      expect(() => pattern.generalize(-1)).toThrow('Invalid segment index');
      expect(() => pattern.generalize(5)).toThrow('Invalid segment index');
    });
  });

  describe('pattern enumeration', () => {
    it('should enumerate possible matches', () => {
      const pattern = HierarchicalPattern.fromString('exec1:*:root');
      const availableSegments = ['FIBER_CLOSED', 'FIBER_OPENED', 'NODE'];
      const matches = pattern.enumerateMatches(availableSegments, 3);

      const matchStrings = matches.map(k => k.toString());
      expect(matchStrings).toContain('exec1:FIBER_CLOSED:root');
      expect(matchStrings).toContain('exec1:FIBER_OPENED:root');
      expect(matchStrings).toContain('exec1:NODE:root');
      expect(matchStrings).toHaveLength(3);
    });

    it('should limit enumeration depth', () => {
      const pattern = HierarchicalPattern.fromString('*:concrete');
      const availableSegments = ['A', 'B'];
      const matches = pattern.enumerateMatches(availableSegments, 3);

      expect(matches).toHaveLength(2); // A:concrete, B:concrete
      expect(matches.map(k => k.toString())).toEqual([
        'A:concrete',
        'B:concrete',
      ]);
    });
  });

  describe('serialization', () => {
    const pattern = HierarchicalPattern.fromString('exec1:*:root');

    it('should serialize to JSON', () => {
      expect(pattern.toJSON()).toBe('exec1:*:root');
    });

    it('should deserialize from JSON', () => {
      const json = pattern.toJSON();
      const deserializedPattern = HierarchicalPattern.fromJSON(json);
      expect(deserializedPattern.equals(pattern)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty pattern', () => {
      const pattern = HierarchicalPattern.fromString('');
      expect(pattern.getSegments()).toEqual(['']);
      expect(pattern.isExact()).toBe(true);
    });

    it('should handle single wildcard', () => {
      const pattern = HierarchicalPattern.fromString('*');
      expect(pattern.getSegments()).toEqual(['*']);
      expect(pattern.isWildcard()).toBe(true);
      expect(pattern.getSpecificity()).toBe(0);
    });

    it('should handle patterns with special characters', () => {
      const pattern = HierarchicalPattern.fromString(
        'exec1:FIBER:root/path/~/0/-',
      );
      expect(pattern.getSegments()).toEqual([
        'exec1',
        'FIBER',
        'root/path/~/0/-',
      ]);
    });

    it('should be immutable', () => {
      const pattern = HierarchicalPattern.fromString('exec1:*:root');
      const segments = pattern.getSegments();

      // The returned array should be frozen (readonly)
      expect(Object.isFrozen(segments)).toBe(true);
    });
  });

  describe('equality', () => {
    it('should check equality correctly', () => {
      const pattern1 = HierarchicalPattern.fromString('exec1:*:root');
      const pattern2 = HierarchicalPattern.fromString('exec1:*:root');
      const pattern3 = HierarchicalPattern.fromString('exec1:*:other');
      const pattern4 = HierarchicalPattern.fromString('exec1:*:*'); // normalizes to "exec1:*"

      expect(pattern1.equals(pattern2)).toBe(true);
      expect(pattern1.equals(pattern3)).toBe(false);
      expect(pattern1.equals(pattern4)).toBe(false);
    });

    it('should handle normalized equality', () => {
      const pattern1 = HierarchicalPattern.fromString('exec1:*');
      const pattern2 = HierarchicalPattern.fromString('exec1:*:*');

      expect(pattern1.equals(pattern2)).toBe(true); // Both normalize to 'exec1:*'
    });
  });
});

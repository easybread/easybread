import { HierarchicalKey } from './HierarchicalKey';

describe('HierarchicalKey', () => {
  describe('construction', () => {
    it('should create from string', () => {
      const key = HierarchicalKey.fromString(
        'exec1:FIBER_CLOSED:root/paginate/cmd:-/0/-/1/-/-',
      );
      expect(key.toString()).toBe(
        'exec1:FIBER_CLOSED:root/paginate/cmd:-/0/-/1/-/-',
      );
      expect(key.getSegments()).toEqual([
        'exec1',
        'FIBER_CLOSED',
        'root/paginate/cmd',
        '-/0/-/1/-/-',
      ]);
    });

    it('should create from segments array', () => {
      const segments = ['exec1', 'FIBER_CLOSED', 'root/paginate/cmd'];
      const key = HierarchicalKey.fromSegments(segments);
      expect(key.toString()).toBe('exec1:FIBER_CLOSED:root/paginate/cmd');
      expect(key.getSegments()).toEqual(segments);
    });

    it('should create using builder', () => {
      const key = HierarchicalKey.builder()
        .segment('exec1')
        .segment('FIBER_CLOSED')
        .path('root/paginate/cmd')
        .segment('extra')
        .build();

      expect(key.toString()).toBe('exec1:FIBER_CLOSED:root:paginate:cmd:extra');
    });
  });

  describe('basic operations', () => {
    let key: HierarchicalKey;

    beforeEach(() => {
      key = HierarchicalKey.fromString('exec1:FIBER_CLOSED:root:paginate:cmd');
    });

    it('should get segments', () => {
      expect(key.getSegments()).toEqual([
        'exec1',
        'FIBER_CLOSED',
        'root',
        'paginate',
        'cmd',
      ]);
      expect(key.getSegment(0)).toBe('exec1');
      expect(key.getSegment(2)).toBe('root');
      expect(key.getSegment(10)).toBeUndefined();
    });

    it('should get segment count', () => {
      expect(key.getSegmentCount()).toBe(5);
    });

    it('should get leaf and parent', () => {
      expect(key.getLeaf()).toBe('cmd');
      expect(key.getParent()?.toString()).toBe(
        'exec1:FIBER_CLOSED:root:paginate',
      );

      const singleSegment = HierarchicalKey.fromString('single');
      expect(singleSegment.getParent()).toBeNull();
    });
  });

  describe('hierarchy operations', () => {
    const rootKey = HierarchicalKey.fromString('exec1');
    const parentKey = HierarchicalKey.fromString('exec1:FIBER_CLOSED');
    const childKey = HierarchicalKey.fromString('exec1:FIBER_CLOSED:root');
    const grandchildKey = HierarchicalKey.fromString(
      'exec1:FIBER_CLOSED:root:paginate',
    );
    const unrelatedKey = HierarchicalKey.fromString('exec2:OTHER');

    it('should check startsWith correctly', () => {
      expect(grandchildKey.startsWith(rootKey)).toBe(true);
      expect(grandchildKey.startsWith(parentKey)).toBe(true);
      expect(grandchildKey.startsWith(childKey)).toBe(true);
      expect(grandchildKey.startsWith(grandchildKey)).toBe(true);
      expect(grandchildKey.startsWith(unrelatedKey)).toBe(false);

      expect(rootKey.startsWith(grandchildKey)).toBe(false);
    });

    it('should check ancestor/descendant relationships', () => {
      expect(rootKey.isAncestorOf(grandchildKey)).toBe(true);
      expect(parentKey.isAncestorOf(grandchildKey)).toBe(true);
      expect(childKey.isAncestorOf(grandchildKey)).toBe(true);
      expect(grandchildKey.isAncestorOf(grandchildKey)).toBe(false); // self
      expect(unrelatedKey.isAncestorOf(grandchildKey)).toBe(false);

      expect(grandchildKey.isDescendantOf(rootKey)).toBe(true);
      expect(grandchildKey.isDescendantOf(parentKey)).toBe(true);
      expect(grandchildKey.isDescendantOf(childKey)).toBe(true);
      expect(grandchildKey.isDescendantOf(grandchildKey)).toBe(false); // self
      expect(grandchildKey.isDescendantOf(unrelatedKey)).toBe(false);
    });

    it('should get ancestors', () => {
      const ancestors = grandchildKey.getAncestors();
      expect(ancestors.map(k => k.toString())).toEqual([
        'exec1',
        'exec1:FIBER_CLOSED',
        'exec1:FIBER_CLOSED:root',
      ]);
    });

    it('should find common ancestor', () => {
      const key1 = HierarchicalKey.fromString(
        'exec1:FIBER_CLOSED:root:branch1',
      );
      const key2 = HierarchicalKey.fromString(
        'exec1:FIBER_CLOSED:root:branch2',
      );
      const key3 = HierarchicalKey.fromString('exec2:OTHER');

      expect(key1.getCommonAncestor(key2)?.toString()).toBe(
        'exec1:FIBER_CLOSED:root',
      );
      expect(key1.getCommonAncestor(key3)).toBeNull();
      expect(rootKey.getCommonAncestor(key1)?.toString()).toBe('exec1');
    });
  });

  describe('manipulation operations', () => {
    let key: HierarchicalKey;

    beforeEach(() => {
      key = HierarchicalKey.fromString('exec1:FIBER_CLOSED:root');
    });

    it('should slice segments', () => {
      expect(key.slice(1).toString()).toBe('FIBER_CLOSED:root');
      expect(key.slice(0, 2).toString()).toBe('exec1:FIBER_CLOSED');
      expect(key.slice(1, 2).toString()).toBe('FIBER_CLOSED');
    });

    it('should append segments', () => {
      const newKey = key.append('paginate', 'cmd');
      expect(newKey.toString()).toBe('exec1:FIBER_CLOSED:root:paginate:cmd');
      expect(key.toString()).toBe('exec1:FIBER_CLOSED:root'); // original unchanged
    });

    it('should prepend segments', () => {
      const newKey = key.prepend('prefix1', 'prefix2');
      expect(newKey.toString()).toBe('prefix1:prefix2:exec1:FIBER_CLOSED:root');
      expect(key.toString()).toBe('exec1:FIBER_CLOSED:root'); // original unchanged
    });
  });

  describe('comparison and equality', () => {
    const key1 = HierarchicalKey.fromString('exec1:FIBER_CLOSED:root');
    const key2 = HierarchicalKey.fromString('exec1:FIBER_CLOSED:root');
    const key3 = HierarchicalKey.fromString('exec1:FIBER_CLOSED:other');

    it('should check equality', () => {
      expect(key1.equals(key2)).toBe(true);
      expect(key1.equals(key3)).toBe(false);
    });

    it('should compare lexicographically', () => {
      expect(key1.compareTo(key2)).toBe(0);
      expect(key3.compareTo(key1)).toBeLessThan(0); // 'other' < 'root'
      expect(key1.compareTo(key3)).toBeGreaterThan(0); // 'root' > 'other'
    });
  });

  describe('builder pattern', () => {
    it('should support fluent interface', () => {
      const builder = HierarchicalKey.builder();

      const key = builder
        .segment('exec1')
        .addSegments('FIBER_CLOSED', 'root')
        .path('paginate/cmd')
        .build();

      expect(key.toString()).toBe('exec1:FIBER_CLOSED:root:paginate:cmd');
    });

    it('should support reset', () => {
      const builder = HierarchicalKey.builder();

      builder.segment('first').segment('second');
      builder.reset();
      const key = builder.segment('new').build();

      expect(key.toString()).toBe('new');
    });

    it('should handle path splitting correctly', () => {
      const key = HierarchicalKey.builder()
        .path('root/paginate/cmd/-/0/-/1')
        .build();

      expect(key.getSegments()).toEqual([
        'root',
        'paginate',
        'cmd',
        '-',
        '0',
        '-',
        '1',
      ]);
    });
  });

  describe('serialization', () => {
    const key = HierarchicalKey.fromString('exec1:FIBER_CLOSED:root:paginate');

    it('should serialize to JSON', () => {
      expect(key.toJSON()).toBe('exec1:FIBER_CLOSED:root:paginate');
    });

    it('should deserialize from JSON', () => {
      const json = key.toJSON();
      const deserializedKey = HierarchicalKey.fromJSON(json);
      expect(deserializedKey.equals(key)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      const key = HierarchicalKey.fromString('');
      expect(key.getSegments()).toEqual(['']);
      expect(key.getSegmentCount()).toBe(1);
    });

    it('should handle single segment', () => {
      const key = HierarchicalKey.fromString('single');
      expect(key.getSegments()).toEqual(['single']);
      expect(key.getLeaf()).toBe('single');
      expect(key.getParent()).toBeNull();
    });

    it('should handle segments with special characters', () => {
      const key = HierarchicalKey.fromString('exec1:FIBER:root/path/-/0/-');
      expect(key.getSegments()).toEqual(['exec1', 'FIBER', 'root/path/-/0/-']);
    });

    it('should be immutable', () => {
      const key = HierarchicalKey.fromString('exec1:FIBER_CLOSED:root');
      const segments = key.getSegments();

      // The returned array should be frozen (readonly)
      expect(Object.isFrozen(segments)).toBe(true);
    });
  });
});

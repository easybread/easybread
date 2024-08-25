import { breadDataAdapter } from '../lib/bread.data-adapter';

type External = { a: string; b: number };
type Internal = { c: string; d: number };

const dataAdapter = breadDataAdapter<External, Internal>({
  toExternal: { c: 'a', d: 'b' },
  toInternal: { a: 'c', b: 'd' },
});

it('should transform external to internal', () => {
  expect(dataAdapter.toInternal({ c: 'val', d: 15 })).toEqual({
    a: 'val',
    b: 15,
  });
});

it('should transform internal to external', () => {
  expect(dataAdapter.toExternal({ a: 'val', b: 15 })).toEqual({
    c: 'val',
    d: 15,
  });
});

it(`should allow for composition`, () => {
  type ExternalFoo = { a: string };
  type InternalFoo = { b: string };

  type External = { foo: ExternalFoo };
  type Internal = { foo: InternalFoo };

  const fooAdapter = breadDataAdapter<ExternalFoo, InternalFoo>({
    toExternal: { b: 'a' },
    toInternal: { a: 'b' },
  });

  // TODO: consider improving the composition pattern
  const adapter = breadDataAdapter<External, Internal>({
    toExternal: { foo: (i) => fooAdapter.toExternal(i.foo) },
    toInternal: { foo: (i) => fooAdapter.toInternal(i.foo) },
  });

  expect(adapter.toExternal({ foo: { a: 'val' } })).toEqual({
    foo: { b: 'val' },
  });
  expect(adapter.toInternal({ foo: { b: 'val' } })).toEqual({
    foo: { a: 'val' },
  });
});

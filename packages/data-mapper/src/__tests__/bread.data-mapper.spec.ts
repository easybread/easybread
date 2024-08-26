import { BreadDataMapper } from '..';
import { Readable } from 'node:stream';

it(`should work with plain objects with primitive types`, async () => {
  type Input = {
    a: string;
    b: number;
    c: boolean;
    d: bigint;
    e: symbol;
  };

  type Output = {
    str: string;
    num: number;
    bool: boolean;
    bigInt: bigint;
    symbol: symbol;
  };

  const mapper = BreadDataMapper.create<Input, Output>({
    str: 'a',
    num: 'b',
    bool: 'c',
    bigInt: 'd',
    symbol: 'e',
  });

  const actual = mapper.map({
    a: 'smth',
    b: 1,
    c: true,
    d: 1n,
    e: Symbol.for('test'),
  });

  expect(actual).toEqual({
    str: 'smth',
    num: 1,
    bool: true,
    bigInt: 1n,
    symbol: Symbol.for('test'),
  } satisfies Output);
});

it(`should work with literal types`, async () => {
  type Input = {
    doesntMatter: string;
  };

  type Output = {
    stringLiteral: 'WithLiterals';
    numberLiteral: 100;
    boolLiteral: false;
    bigintLiteral: 1n;
  };

  const mapper = BreadDataMapper.create<Input, Output>({
    stringLiteral: () => 'WithLiterals' as const,
    boolLiteral: () => false as const,
    numberLiteral: () => 100 as const,
    bigintLiteral: () => 1n as const,
  });

  const actual = mapper.map({ doesntMatter: 'anything' });

  expect(actual).toEqual({
    stringLiteral: 'WithLiterals',
    numberLiteral: 100,
    boolLiteral: false,
    bigintLiteral: 1n,
  } satisfies Output);
});

it(`should work with nested objects`, async () => {
  type Input = { a: string; b: number; c: boolean };

  type Output = {
    a: string;
    levelOne: { b: number; levelTwo: { c: boolean } };
  };

  const mapper = BreadDataMapper.create<Input, Output>({
    a: 'a',
    levelOne: {
      b: 'b',
      levelTwo: { c: 'c' },
    },
  });

  const actual = mapper.map({
    a: 'a',
    b: 1,
    c: true,
  });

  expect(actual).toEqual({
    a: 'a',
    levelOne: {
      b: 1,
      levelTwo: { c: true },
    },
  } satisfies Output);
});

it(`should work with with nested native objects`, async () => {
  type Input = { a: Date; b: Readable };
  type Output = { nested: { date: Date; stream: Readable } };

  const mapper = BreadDataMapper.create<Input, Output>({
    nested: {
      date: 'a',
      stream: 'b',
    },
  });

  const stream = new Readable();
  const date = new Date();

  const actual = mapper.map({ a: date, b: stream });

  expect(actual).toEqual({ nested: { date, stream } } satisfies Output);
});

it(`should work with arrays via the factory functions`, async () => {
  type Input = { a: string; b: number };
  type OutputArrayItem = { type: 'A'; a: string } | { type: 'B'; b: number };
  type Output = { array: OutputArrayItem[] };

  const mapper = BreadDataMapper.create<Input, Output>({
    array: (input) => [
      { type: 'A', a: input.a },
      { type: 'B', b: input.b },
    ],
  });

  const actual = mapper.map({ a: 'val', b: 15 });

  expect(actual).toEqual({
    array: [
      { type: 'A', a: 'val' },
      { type: 'B', b: 15 },
    ],
  } satisfies Output);
});

it(`should be composable`, async () => {
  type Input = { a: string; b: number };
  type Foo = { fooVal: string };
  type Bar = { barVal: number };
  type Output = { foo: Foo; bar: Bar };

  const fooMapper = BreadDataMapper.create<Input, Foo>({
    fooVal: 'a',
  });
  const barMapper = BreadDataMapper.create<Input, Bar>({
    barVal: 'b',
  });

  const outputMapper = BreadDataMapper.create<Input, Output>({
    foo: fooMapper,
    bar: barMapper,
  });

  const actual = outputMapper.map({ a: 'val', b: 15 });

  expect(actual).toEqual({
    foo: { fooVal: 'val' },
    bar: { barVal: 15 },
  } satisfies Output);
});

it(`should work with a more complex composition`, async () => {
  type InputFoo = { a: string };
  type Input = { foo: InputFoo };

  type OutputFoo = { fooVal: string };
  type Output = { foo: OutputFoo };

  const fooMapper = BreadDataMapper.create<InputFoo, OutputFoo>({
    fooVal: 'a',
  });

  const mapper = BreadDataMapper.create<Input, Output>({
    foo: (i) => fooMapper.map(i.foo),
  });

  const actual = mapper.map({ foo: { a: 'val' } });

  expect(actual).toEqual({ foo: { fooVal: 'val' } } satisfies Output);
});

it(`should work with missing properties`, async () => {
  type Input = { a: string; b: number; d?: string };
  type Output = { a: string; b: number; c: string; d: string };

  const mapper = BreadDataMapper.create<Input, Output>({
    a: 'a',
    b: 'b',
    c: 'd',
    d: null,
  });

  const actual = mapper.map({ a: 'val', b: 15 });

  expect(actual).toEqual({
    a: 'val',
    b: 15,
    c: undefined,
    d: null,
  } satisfies Partial<Output>);
});

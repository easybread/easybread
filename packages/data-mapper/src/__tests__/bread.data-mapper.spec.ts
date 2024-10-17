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
    bigInt: 'd',
    symbol: 'e',
    // bool: () => true,
    bool: 'c',
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
    c: 'NO_MAP',
    d: (input) => input.d ?? 'NO_MAP',
  });

  const actual = mapper.map({ a: 'val', b: 15 });

  expect(actual).toEqual({
    a: 'val',
    b: 15,
    c: undefined,
  } satisfies Partial<Output>);
});

it(`should work with optional properties`, async () => {
  type Input = { a: string; b?: string; type: 'Input' };
  type Output = { a: string; b?: string; __type: 'Output' };

  const mapper = BreadDataMapper.create<Input, Output>({
    a: 'a',
    b: 'b',
    __type: () => 'Output',
  });

  expect(
    mapper.map({
      a: '1',
      b: '2',
      type: 'Input',
    })
  ).toEqual({
    a: '1',
    b: '2',
    __type: 'Output',
  } satisfies Output);
});

it(`should work with optional fields on input type`, async () => {
  type Input = { a?: string; b?: number };
  type Output = { a: string; b: number; c?: string };

  const mapper = BreadDataMapper.create<Input, Output>({
    a: (_) => _.a ?? 'NO_MAP',
    b: (_) => _.b ?? 'NO_MAP',
  });

  expect(mapper.map({ b: 15 })).toEqual({ b: 15 });
  expect(mapper.map({ a: 'val' })).toEqual({ a: 'val' });
});

it(`should work with optional fields on output type`, async () => {
  type Input = { a: string; b: number };
  type Output = { a?: string; b?: number };

  const mapper = BreadDataMapper.create<Input, Output>({
    a: 'a',
    b: 'b',
  });

  expect(mapper.map({ a: 'val', b: 15 })).toEqual({
    a: 'val',
    b: 15,
  });
});

it(`should allow value factory functions`, async () => {
  type Input = { type: 'Input'; b: number };
  type Output = { type: 'Output'; b: string };

  const mapper = BreadDataMapper.create<Input, Output>({
    type: () => 'Output',
    b: (_) => _.b.toString(),
  });

  expect(mapper.map({ b: 1, type: 'Input' })).toEqual({
    b: '1',
    type: 'Output',
  } satisfies Output);
});

it(`should skip fields marked as NO_MAP`, () => {
  type Input = { str: string; num: number };
  type Output = { a: string; b: number };

  const mapper = BreadDataMapper.create<Input, Output>({
    a: 'str',
    b: 'NO_MAP',
  });

  expect(
    mapper.map({
      str: 'value',
      num: 12,
    })
  ).toEqual({ a: 'value' } satisfies Partial<Output>);
});

# data-adapter

Simple module to map from and to internal and external types.

### Simple Use Case

```ts
import { breadDataAdapter } from '@easybread/data-adapter';

type External = { a: string; b: number };
type Internal = { c: string; d: number };

const dataAdapter = breadDataAdapter<External, Internal>({
  toExternal: { c: 'a', d: 'b' },
  toInternal: { a: 'c', b: 'd' },
});
```

### Composition Use Case

```ts
import { breadDataAdapter } from '@easybread/data-adapter';

type ExternalFoo = { a: string };
type InternalFoo = { b: string };

type External = { foo: ExternalFoo };
type Internal = { foo: InternalFoo };

const fooAdapter = breadDataAdapter<ExternalFoo, InternalFoo>({
  toExternal: { b: 'a' },
  toInternal: { a: 'b' },
});

const adapter = breadDataAdapter<External, Internal>({
  toExternal: { foo: (i) => fooAdapter.toExternal(i.foo) },
  toInternal: { foo: (i) => fooAdapter.toInternal(i.foo) },
});
```


## Building

Run `nx build data-adapter` to build the library.

## Running unit tests

Run `nx test data-adapter` to execute the unit tests via [Jest](https://jestjs.io).


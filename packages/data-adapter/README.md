# @easybread/data-adapter

Declarative, two-way mapping between an external API shape and your internal
(BreadSchema) shape. Primarily used by service-adapter authors.

## Install

```shell
pnpm add @easybread/data-adapter
```

## Usage

```ts
import { breadDataAdapter } from '@easybread/data-adapter';

type External = { a: string; b: number };
type Internal = { c: string; d: number };

const dataAdapter = breadDataAdapter<External, Internal>({
  toExternal: { c: 'a', d: 'b' },
  toInternal: { a: 'c', b: 'd' },
});
```

It is built on top of the lower-level [`@easybread/data-mapper`](../data-mapper).

## Development

Run `nx test data-adapter` to execute the unit tests and `nx build data-adapter` to build.

# @easybread/schemas

The unified **BreadSchema** data model shared by every EasyBREAD operation.

## Install

```shell
pnpm add @easybread/schemas
```

## What's inside

BreadSchema types are derived from the [Schema.org](https://schema.org/) vocabulary
and strive to comply with its specifications. They give you a single, provider-agnostic
shape for data regardless of which adapter produced it — for example `PersonSchema`
looks identical whether it came from Google, BambooHR or Rocket.Chat.

```ts
import type { PersonSchema } from '@easybread/schemas';

const user: PersonSchema = results.payload;
// results.rawPayload still holds the original provider response when you need it.
```

## Development

Run `nx test schemas` to execute the unit tests and `nx build schemas` to build.

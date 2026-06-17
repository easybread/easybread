# @easybread/core

The heart of [EasyBREAD](../../README.md). Provides the `EasyBreadClient`, the
operation executor and the base classes every adapter builds on.

## Install

```shell
pnpm add @easybread/core
```

## What's inside

- **`EasyBreadClient`** — the single entry point your application uses to
  `invoke(operation, input)` against any service adapter.
- **Base adapter contracts** — `BreadServiceAdapter`, auth strategies
  (`BreadOAuth2AuthStrategy`, basic-auth strategies, …) and the `StateAdapter`
  interface.
- **`InMemoryStateAdapter`** — a zero-dependency state adapter, handy for tests and
  getting started. Persistent state adapters are published separately
  (e.g. [`@easybread/state-adapter-mongo`](../state-adapter-mongo)).
- **Command/execution plumbing** — command handlers, command context, the
  `BreadEventBus`, the HTTP transport and command-output factories.

## Usage

```ts
import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';

const stateAdapter = new InMemoryStateAdapter();
// the auth strategy is passed to the service adapter, which is passed to the client
const client = new EasyBreadClient(stateAdapter, serviceAdapter);
```

See the [Getting Started guide](../../docs/easybread/app/docs/guide/getting-started.md)
and the [Mental Model](../../docs/easybread/app/docs/guide/mental-model.md) for the
full picture.

## Development

Run `nx test core` to execute the unit tests and `nx build core` to build the library.

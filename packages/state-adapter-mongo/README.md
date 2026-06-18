# @easybread/state-adapter-mongo

A MongoDB-backed [`StateAdapter`](../core) for EasyBREAD. Use it to persist auth data
(OAuth tokens, refresh tokens, basic-auth credentials, …) outside of memory.

## Install

```shell
pnpm add @easybread/state-adapter-mongo mongodb
```

## Usage

`StateAdapterMongo` is created through async factory methods — either from an existing
`MongoClient` or directly from a connection URL:

```ts
import { EasyBreadClient } from '@easybread/core';
import { StateAdapterMongo } from '@easybread/state-adapter-mongo';

const stateAdapter = await StateAdapterMongo.fromConnectionUrl(
  'mongodb://localhost:27017/my-db',
);

const client = new EasyBreadClient(stateAdapter, serviceAdapter, authStrategy);
```

State adapters are interchangeable — the in-memory adapter from `@easybread/core` is
great for tests, while this adapter is suited for production where auth data must
survive restarts.

## Development

Run `nx test state-adapter-mongo` and `nx build state-adapter-mongo`. The tests use
`mongodb-memory-server`, which downloads a MongoDB binary on first run.

# @easybread/adapter-rocket-chat-users

[EasyBREAD](../../../../README.md) service adapter for
[Rocket.Chat](https://www.rocket.chat/) users.

## Install

```shell
pnpm add @easybread/adapter-rocket-chat-common @easybread/adapter-rocket-chat-users
```

## Authentication

Uses **Basic auth** via `RocketChatAuthStrategy` from
[`@easybread/adapter-rocket-chat-common`](../common). Set the credentials with
`AUTH_BASIC_SET` before invoking user operations.

```ts
import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';
import { RocketChatAuthStrategy } from '@easybread/adapter-rocket-chat-common';
import { RocketChatUsersAdapter } from '@easybread/adapter-rocket-chat-users';

const stateAdapter = new InMemoryStateAdapter();
const authStrategy = new RocketChatAuthStrategy(stateAdapter);
const serviceAdapter = new RocketChatUsersAdapter(authStrategy, {
  serverUrl: 'https://your-rocket-chat.example.com',
});
const client = new EasyBreadClient(stateAdapter, serviceAdapter);
```

## Operations

- Auth: `AUTH_BASIC_SET`
- Users: `BASIC_USER_SEARCH`, `BASIC_USER_BY_ID`

## Development

Run `nx test service-adapters-rocket-chat-users` and
`nx build service-adapters-rocket-chat-users`.

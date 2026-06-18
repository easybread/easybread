---
sidebar_position: 1
sidebar_label: Overview
---

# Rocket.Chat Adapter Overview

EasyBREAD service adapter for [Rocket.Chat](https://www.rocket.chat/) users.

## Installation

```bash
pnpm add @easybread/adapter-rocket-chat-common @easybread/adapter-rocket-chat-users
```

## Setup the client

The Rocket.Chat adapter needs the URL of your Rocket.Chat server. The auth strategy is
provided by the shared `@easybread/adapter-rocket-chat-common` package.

```ts
import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';
import { RocketChatAuthStrategy } from '@easybread/adapter-rocket-chat-common';
import { RocketChatUsersAdapter } from '@easybread/adapter-rocket-chat-users';

const stateAdapter = new InMemoryStateAdapter();
const authStrategy = new RocketChatAuthStrategy(stateAdapter);
const serviceAdapter = new RocketChatUsersAdapter(authStrategy, {
  serverUrl: 'https://your-rocket-chat.example.com',
});

export const client = new EasyBreadClient(stateAdapter, serviceAdapter);
```

## Authentication

Rocket.Chat uses **Basic auth** with a personal access token. Provide the Rocket.Chat
`userId` as the username and the auth token as the password via `AUTH_BASIC_SET`.

```ts
import { ROCKET_CHAT_USERS_COMMAND_NAME } from '@easybread/adapter-rocket-chat-users';

export async function rocketChatAuthenticate(
  breadId: string,
  userId: string,
  authToken: string,
) {
  await client.invoke(ROCKET_CHAT_USERS_COMMAND_NAME.AUTH_BASIC_SET, {
    breadId,
    params: null,
    payload: {
      '@context': 'https://schema.easybread.io/auth',
      '@type': 'CredentialBasic',
      username: userId,
      password: authToken,
    },
  });
}
```

## Operations

| Operation | Description |
| --- | --- |
| `AUTH_BASIC_SET` | Store the Rocket.Chat user id & auth token. |
| `BASIC_USER_SEARCH` | List users (`PersonSchema[]`, offset pagination). |
| `BASIC_USER_BY_ID` | Fetch a single user by `identifier`. |

### Users Search

```ts
import { ROCKET_CHAT_USERS_COMMAND_NAME } from '@easybread/adapter-rocket-chat-users';
import type { PersonSchema } from '@easybread/schemas';

export async function rocketChatUsersSearch(
  breadId: string,
  query: string,
): Promise<PersonSchema[]> {
  const result = await client.invoke(ROCKET_CHAT_USERS_COMMAND_NAME.BASIC_USER_SEARCH, {
    breadId,
    params: { '@type': 'SearchAction', query },
    pagination: { type: 'OFFSET', offset: 0, limit: 20 },
  });

  if (result.success === false) {
    throw new Error('Rocket.Chat users search failed', { cause: result.rawPayload });
  }

  return result.payload;
}
```

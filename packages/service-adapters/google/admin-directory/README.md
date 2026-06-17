# @easybread/adapter-google-admin-directory

[EasyBREAD](../../../../README.md) service adapter for the
[Google Admin Directory API](https://developers.google.com/admin-sdk/directory).

## Install

```shell
pnpm add @easybread/adapter-google-common @easybread/adapter-google-admin-directory
```

## Authentication

Uses **OAuth 2.0** via `GoogleAdminDirectoryAuthStrategy` (a subclass of the shared
Google OAuth strategy from [`@easybread/adapter-google-common`](../common)).

```ts
import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';
import {
  GoogleAdminDirectoryAdapter,
  GoogleAdminDirectoryAuthStrategy,
} from '@easybread/adapter-google-admin-directory';

const stateAdapter = new InMemoryStateAdapter();
const authStrategy = new GoogleAdminDirectoryAuthStrategy(stateAdapter, {
  clientId, clientSecret, redirectUri,
});
const client = new EasyBreadClient(
  stateAdapter,
  new GoogleAdminDirectoryAdapter(authStrategy),
);
```

## Operations

- Auth: `AUTH_OAUTH2_START`, `AUTH_OAUTH2_COMPLETE`
- Users: `BASIC_USER_SEARCH`, `BASIC_USER_BY_ID`, `BASIC_USER_CREATE`, `BASIC_USER_UPDATE`, `BASIC_USER_DELETE`

See the
[Google Admin Directory adapter docs](../../../../docs/easybread/app/docs/adapters/Google/Admin%20Directory/overview.md).

## Development

Run `nx test service-adapters-google-admin-directory` and
`nx build service-adapters-google-admin-directory`.

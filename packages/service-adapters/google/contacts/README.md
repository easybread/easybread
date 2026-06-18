# @easybread/adapter-google-contacts

[EasyBREAD](../../../../README.md) service adapter for
[Google Contacts](https://developers.google.com/people).

## Install

```shell
pnpm add @easybread/adapter-google-common @easybread/adapter-google-contacts
```

## Authentication

Uses **OAuth 2.0** via the shared Google auth flow from
[`@easybread/adapter-google-common`](../common).

```ts
import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';
import {
  GoogleContactsAdapter,
  GoogleContactsAuthStrategy,
} from '@easybread/adapter-google-contacts';

const stateAdapter = new InMemoryStateAdapter();
const authStrategy = new GoogleContactsAuthStrategy(stateAdapter, {
  clientId, clientSecret, redirectUri,
});
const client = new EasyBreadClient(
  stateAdapter,
  new GoogleContactsAdapter(authStrategy),
);
```

## Operations

- Auth: `AUTH_OAUTH2_START`, `AUTH_OAUTH2_COMPLETE`
- Contacts: `BASIC_USER_SEARCH`, `BASIC_USER_BY_ID`, `BASIC_USER_CREATE`, `BASIC_USER_UPDATE`, `BASIC_USER_DELETE`

## Development

Run `nx test service-adapters-google-contacts` and
`nx build service-adapters-google-contacts`.

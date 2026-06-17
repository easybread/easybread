---
sidebar_position: 1
sidebar_label: Overview
---

# Google Contacts Adapter Overview

EasyBREAD service adapter for [Google Contacts](https://developers.google.com/people).

## Installation

```bash
pnpm add @easybread/adapter-google-common @easybread/adapter-google-contacts
```

## Prerequisites

1. Enable the relevant Google Contacts / People API in your
   [GCP APIs & Services dashboard](https://console.cloud.google.com/apis/dashboard).
2. Create OAuth 2.0 Client ID credentials in the
   [GCP Credentials page](https://console.cloud.google.com/apis/credentials).
3. Configure the OAuth consent screen.

Note the Client ID, Client Secret and Redirect URI.

## Setup the client

```ts
import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';
import {
  GoogleContactsAdapter,
  GoogleContactsAuthStrategy,
} from '@easybread/adapter-google-contacts';

const stateAdapter = new InMemoryStateAdapter();
const authStrategy = new GoogleContactsAuthStrategy(stateAdapter, {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI!,
});
const serviceAdapter = new GoogleContactsAdapter(authStrategy);

export const client = new EasyBreadClient(stateAdapter, serviceAdapter);
```

## Authentication

Google Contacts uses **OAuth 2.0** via the shared Google auth flow from
`@easybread/adapter-google-common`. It is a two-step process.

### Step 1 — start the flow

```ts
import { GOOGLE_CONTACTS_COMMAND_NAME } from '@easybread/adapter-google-contacts';

export async function googleContactsAuthStart(breadId: string) {
  const result = await client.invoke(GOOGLE_CONTACTS_COMMAND_NAME.AUTH_OAUTH2_START, {
    breadId,
    params: null,
    payload: {
      '@context': 'https://schema.easybread.io/auth',
      '@type': 'StartOAuth2Request',
      scope: ['https://www.googleapis.com/auth/contacts'],
    },
  });

  if (result.success === false) {
    throw new Error('Failed to start Google OAuth 2.0 flow', { cause: result.rawPayload });
  }

  // redirect the user to this URL
  return result.payload.authenticationUrl;
}
```

### Step 2 — complete the flow

When Google redirects back, read the `code` and `state` query parameters and exchange
them for credentials (stored and refreshed transparently by EasyBREAD).

```ts
import { GOOGLE_CONTACTS_COMMAND_NAME } from '@easybread/adapter-google-contacts';

export async function googleContactsAuthComplete(
  breadId: string,
  code: string,
  state: string,
) {
  const result = await client.invoke(GOOGLE_CONTACTS_COMMAND_NAME.AUTH_OAUTH2_COMPLETE, {
    breadId,
    params: null,
    payload: {
      '@context': 'https://schema.easybread.io/auth',
      '@type': 'CompleteOAuth2Request',
      code,
      state,
    },
  });

  if (result.success === false) {
    throw new Error('Google Contacts auth failed', { cause: result.rawPayload });
  }
}
```

## Operations

| Operation | Description |
| --- | --- |
| `AUTH_OAUTH2_START` / `AUTH_OAUTH2_COMPLETE` | OAuth 2.0 authentication. |
| `BASIC_USER_SEARCH` | Search contacts (`PersonSchema[]`, offset pagination). |
| `BASIC_USER_BY_ID` | Fetch a single contact by `identifier`. |
| `BASIC_USER_CREATE` | Create a contact from a `PersonSchema`. |
| `BASIC_USER_UPDATE` | Update an existing contact. |
| `BASIC_USER_DELETE` | Delete a contact by `identifier`. |

### Contacts Search

```ts
import { GOOGLE_CONTACTS_COMMAND_NAME } from '@easybread/adapter-google-contacts';
import type { PersonSchema } from '@easybread/schemas';

export async function googleContactsSearch(
  breadId: string,
  query: string,
): Promise<PersonSchema[]> {
  const result = await client.invoke(GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_SEARCH, {
    breadId,
    params: { '@type': 'SearchAction', query },
    pagination: { type: 'OFFSET', offset: 0, limit: 25 },
  });

  if (result.success === false) {
    throw new Error('Google contacts search failed', { cause: result.rawPayload });
  }

  return result.payload;
}
```

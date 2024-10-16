---
sidebar_position: 1
sidebar_label: Getting Started
---

## Install easybread

```shell
pnpm add @easybread/core @easybread/schemas @easybread/operations
```

## Install service adapter and its dependencies

> Note, some adapters have dependencies that need to be installed as well, some don't.

```shell
pnpm add @easybread/adapter-google-common @easybread/adapter-google-admin-directory
```

## Setup the client

```ts
import { load } from 'ts-dotenv';
import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';
import {
  GoogleAdminDirectoryAdapter,
  GoogleAdminDirectoryAuthStrategy,
} from '@easybread/adapter-google-admin-directory';

const stateAdapter = new InMemoryStateAdapter();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = load({
  GOOGLE_CLIENT_ID: String,
  GOOGLE_CLIENT_SECRET: String,
  GOOGLE_REDIRECT_URI: String,
});

const serviceAdapter = new GoogleAdminDirectoryAdapter();
const authStrategy = new GoogleAdminDirectoryAuthStrategy(stateAdapter, {
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  redirectUri: GOOGLE_REDIRECT_URI,
});

export const client = new EasyBreadClient(stateAdapter, serviceAdapter, authStrategy);
```

## Authenticate

In this example, we are using Google Admin Directory.  
It uses OAuth 2.0. `GoogleAdminDirectoryAuthStrategy` is a subclass of `BreadOAuth2AuthStrategy`.

Authentication is a two step process:

1. Initiate the authentication flow

```ts
import {
  type GoogleCommonOauth2StartOperation,
  GoogleCommonOperationName,
} from '@easybread/adapter-google-common';
import {
  type GoogleAdminDirectoryAuthScope,
} from '@easybread/adapter-google-admin-directory';

export async function adapterGoogleAdminDirectoryAuthStart(
  breadId: string
): Promise<string> {
  const result = await client.invoke<
    GoogleCommonOauth2StartOperation<GoogleAdminDirectoryAuthScope>
  >({
    name: GoogleCommonOperationName.AUTH_FLOW_START,
    breadId,
    payload: {
      prompt: ['consent'],
      includeGrantedScopes: true,
      loginHint: 'hint',
      scope: [
        'https://www.googleapis.com/auth/admin.directory.user',
        'https://www.googleapis.com/auth/admin.directory.user.readonly',
        'https://www.googleapis.com/auth/cloud-platform',
      ],
    },
  });
  
  // redirect the user to this location.
  return result.rawPayload.data.authUri;
}
```

2. Exchange the authorization code received from the Google OAuth consent screen for an access token

```ts
import {
  type GoogleCommonOauth2CompleteOperation,
  GoogleCommonOperationName,
} from '@easybread/adapter-google-common';

async function googleAdminDirectoryOauthComplete(
  breadId: string,
  code: string,
) {
  const results = await client.invoke<GoogleCommonOauth2CompleteOperation>({
    name: GoogleCommonOperationName.AUTH_FLOW_COMPLETE,
    breadId,
    payload: { code }
  });
  
  // update your database. 
  // You don't have to manage the received access token manually.
  // EasyBREAD will handle the token and refresh it automatically, transparently for you.
}
```

## Use the API

Now you can invoke other operations to interact with the API.

```ts
import {
  type GoogleAdminDirectoryUsersSearchOperation,
  GoogleAdminDirectoryOperationName
} from '@easybread/adapter-google-admin-directory';
import type { PersonSchema } from '@easybread/schemas';

async function googleAdminDirectoryUsersSearch(
  breadId: string,
  query: string
): Promise<{
  payload: PersonSchema[];
  prev: string | number;
  next: string | number;
}> {
  const results =
    await client.invoke<GoogleAdminDirectoryUsersSearchOperation>({
      name: GoogleAdminDirectoryOperationName.USERS_SEARCH,
      params: { query },
      breadId,
      pagination: {
        type: 'PREV_NEXT',
        page,
      },
    });

  const {
    payload,
    pagination: { next, prev },
  } = results;

  // use prev and next pointers to fetch the next or the previous page.
  return { payload, next, prev };
}
```

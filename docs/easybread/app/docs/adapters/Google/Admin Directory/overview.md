---
sidebar_position: 1
sidebar_label: Overview
---

# Google Admin Directory Overview

## Installation

```bash
npm install --save @easybread/adapter-google-common @easybread/adapter-google-admin-directory
```

## Prerequisites
1. Enable Google Admin Directory API in your [GCP APIs and Services Dashboard.](https://console.cloud.google.com/apis/dashboard)
2. Create OAuth2.0 Client ID credentials in the [GCP Credentials page.](https://console.cloud.google.com/apis/credentials)
3. Configure the OAuth consent screen in the [GCP OAuth consent screen page.](https://console.cloud.google.com/apis/credentials/consent)

Make sure to note the Client ID, Client Secret and the Redirect URI.

## Setup the client

Instantiate an `EasyBreadClient` with `GoogleAdminDirectoryAuthStrategy`,
`GoogleAdminDirectoryAdapter` and a state adapter of your choice.

```ts
import { load } from 'ts-dotenv';
import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';
import {
  GoogleAdminDirectoryAdapter,
  GoogleAdminDirectoryAuthStrategy,
} from '@easybread/adapter-google-admin-directory';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = load({
  GOOGLE_CLIENT_ID: String,
  GOOGLE_CLIENT_SECRET: String,
  GOOGLE_REDIRECT_URI: String,
});

const stateAdapter = new InMemoryStateAdapter();

const serviceAdapter = new GoogleAdminDirectoryAdapter();

const authStrategy = new GoogleAdminDirectoryAuthStrategy(stateAdapter, {
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  redirectUri: GOOGLE_REDIRECT_URI,
});

const client = new EasyBreadClient(stateAdapter, serviceAdapter, authStrategy);
```

## Handle authentication lost event

Sometimes, google API might require to re-authenticate the user.
In this case, you can handle the authentication lost event.

You might want to update the database and send the notification to your client side.

```ts
import { BreadAuthenticationLostEvent} from '@easybread/core';

client.subscribe(BreadAuthenticationLostEvent.eventName, async (event) => {
  const { breadId, provider, error } = event.payload;
  // handle the event.
});
```

---
sidebar_position: 2
sidebar_label: Authentication
---

# Google Admin Directory Authentication

OAuth2.0 authentication is required to access the Google Admin Directory API.

There are three steps involved:
1. Initiate the authentication flow
2. Redirect the user to the Google OAuth consent screen
3. Exchange the authorization code for an access token

`GoogleAdminDirectoryAdapter` provides two operations for this purpose:

### GoogleCommonOauth2StartOperation

```ts
import { randomBytes } from 'node:crypto';
import {
  type GoogleCommonOauth2StartOperation,
  GoogleCommonOperationName,
} from '@easybread/adapter-google-common';
import {
  type GoogleAdminDirectoryAuthScope,
} from '@easybread/adapter-google-admin-directory';

export async function adapterGoogleAdminDirectoryAuthStart(
  breadId: string
) {
  // This token is used to verify the authenticity of the callback
  // from the Google OAuth consent screen.
  // Store it in your database.
  const googleOauthSessionToken = randomBytes(16).toString('hex');

  const result = await client.invoke<
    // note, that you need to specify the Auth Scope type,
    // Otherwise the IDE would not be able to autocomplete the scopes.
    GoogleCommonOauth2StartOperation<GoogleAdminDirectoryAuthScope>
  >({
    name: GoogleCommonOperationName.AUTH_FLOW_START,
    breadId,
    payload: {
      prompt: ['consent'],
      includeGrantedScopes: true,
      loginHint: 'hint',
      scope: [
        // you can use IDE autocomplete to see all the scopes,
        'https://www.googleapis.com/auth/admin.directory.user',
        'https://www.googleapis.com/auth/admin.directory.user.readonly',
        'https://www.googleapis.com/auth/cloud-platform',
      ],
      // you can add other data to the state.
      // It will be returned back to you in the callback.
      // Refer to google documentation for the details.
      state: googleOauthSessionToken,
    },
  });

  if (result.rawPayload.success === false) {
    // handle the error
    throw new Error('Failed to initiate Google OAuth2.0 flow', {
      cause: result.rawPayload,
    });
  }

  // redirect the user to this location.
  console.log(result.rawPayload.data.authUri);
}

```

### GoogleCommonOauth2StartOperation

When you receive the callback from the Google OAuth consent screen,
read the `state` and the `code` query parameters from the URL.

Extract the googleOauthSessionToken from the `state`,
then do:

```ts
import {
  type GoogleCommonOauth2CompleteOperation,
  GoogleCommonOperationName,
} from '@easybread/adapter-google-common';

async function googleAdminDirectoryOauthComplete(
  googleOauthSessionToken: string,
  code: string,
  breadId: string
) {
  // check that the received data is authentic, by comparing it with the stored data.
  await verifyAuthenticity(googleOauthSessionToken, userId);
  
  const results = await client.invoke<GoogleCommonOauth2CompleteOperation>({
    name: GoogleCommonOperationName.AUTH_FLOW_COMPLETE,
    breadId,
    payload: { code }
  });

  if (results.rawPayload.success === false) {
    // handle the error
    new Error('Google Auth Failed', { cause: results.rawPayload });
  }

  // update your database. 
  // You don't have to manage the received access token manually.
  // EasyBREAD will handle the token and refresh it automatically, transparently for you.
}
```

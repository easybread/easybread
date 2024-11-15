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

### Initiate the authentication flow 

Call the `GoogleCommonOperationName.AUTH_FLOW_START` operation with scopes you need.

Then redirect the user to the returned `authUri`.

```ts
import { GoogleCommonOperationName } from '@easybread/adapter-google-common';

export async function adapterGoogleAdminDirectoryAuthStart(
  breadId: string
) {
  const result = await client.invoke(GoogleCommonOperationName.AUTH_FLOW_START, {
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

### Complete the authentication flow 

When you receive the callback from the Google OAuth consent screen,
read the `state` and the `code` query parameters from the URL.

Use them to call the `GoogleCommonOperationName.AUTH_FLOW_COMPLETE`.

It will perform steps 2 and 3 from the [Initiate the authentication flow](#google-admin-directory-authentication) section under the hood.

```ts
import { GoogleCommonOperationName } from '@easybread/adapter-google-common';

async function googleAdminDirectoryOauthComplete(
  breadId: string,
  state: string,
  code: string,
) {
  const results = await client.invoke(GoogleCommonOperationName.AUTH_FLOW_COMPLETE, {
    breadId,
    payload: { code, state }
  });

  if (results.rawPayload.success === false) {
    // handle the error
    new Error('Google Auth Failed', { cause: results.rawPayload });
  }

  // You don't have to manage the received access token manually.
  // EasyBREAD will handle the token and refresh it automatically, transparently for you.
}
```

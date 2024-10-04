---
sidebar_position: 1
sidebar_label: Users Create
---

# Google Admin Directory - User Create Operation

Create a new user.

```ts
import {
  type GoogleAdminDirectoryUsersCreateOperation,
  GoogleAdminDirectoryOperationName
} from '@easybread/adapter-google-admin-directory';

async function googleAdminDirectoryUsersCreate(breadId: string): Promise<PersonSchema> {
  const results =
    await client.invoke<GoogleAdminDirectoryUsersCreateOperation>({
      name: GoogleAdminDirectoryOperationName.USERS_CREATE,
      breadId,
      payload: {
        '@type': 'Person',
        givenName: 'Jane',
        familyName: 'Doe',
      }
    });

  if (results.rawPayload.success === false) {
    // handle the error
    new Error('Google User Create Failed', { cause: results.rawPayload });
  }

  // raw google API response payload
  console.log(results.rawPayload)

  return results.payload;
}
```

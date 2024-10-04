---
sidebar_position: 3
sidebar_label: Users Delete
---

# Google Admin Directory - Users Delete

Delete one user by identifier.
```ts
import {
  type GoogleAdminDirectoryUsersDeleteOperation,
  GoogleAdminDirectoryOperationName
} from '@easybread/adapter-google-admin-directory';
import type { PersonSchema } from '@easybread/schemas';

async function googleAdminDirectoryUsersDelete(
  breadId: string,
  userId: string,
): Promise<PersonSchema> {
  const results =
    await client.invoke<GoogleAdminDirectoryUsersDeleteOperation>({
      name: GoogleAdminDirectoryOperationName.USERS_DELETE,
      breadId,
      payload: {
        '@type': 'Person',
        identifier: userId,
      },
    });

  if (results.rawPayload.success === false) {
    // handle the error
    new Error('Google User Delete Failed', { cause: results.rawPayload });
  }

  // raw google API response payload
  console.log(results.rawPayload);

  return results.payload;
}
```

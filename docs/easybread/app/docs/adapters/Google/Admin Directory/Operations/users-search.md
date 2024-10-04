---
sidebar_position: 2
sidebar_label: Users Search
---

# Google Admin Directory - Users Search Operation

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

  if (results.rawPayload.success === false) {
    // handle the error
    new Error('Google User Search Failed', { cause: results.rawPayload });
  }
  const {
    payload,
    pagination: { next, prev },
  } = results;
  
  // use prev and next pointers to fetch the next or the previous page.
  return { payload, next, prev };
}
```


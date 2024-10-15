---
sidebar_position: 2
sidebar_label: Authentication
---

# Bamboo HR Adapter Authentication

Bamboo HR adapter supports the Basic Authentication.

```ts
import { BreadOperationName } from '@easybread/operations';
import type { BambooHrSetupBasicAuthOperation } from '@easybread/adapter-bamboo-hr';

export async function adapterBaomooHrAuthenticate(
  breadId: string,
  apiKey: string,
  companyName: string
) {
  const results = await client.invoke<BambooHrSetupBasicAuthOperation>({
    name: BreadOperationName.SETUP_BASIC_AUTH,
    breadId,
    payload: { apiKey, companyName },
  });
  
  if (results.rawPayload.success===false) {
    throw new Error('Bamboo HR Setup Basic Auth Failed', {
      cause: results.rawPayload,
    });
  }
}
```

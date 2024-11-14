---
sidebar_position: 3
sidebar_label: Employee Update
---

# Bamboo HR Employee Update

```ts
import { BreadOperationName } from '@easybread/operations';
import type { PersonSchema } from '@easybread/schemas';

export async function adapterBambooHrEmployeeUpdate(
  breadId: string,
  payload: Partial<PersonSchema>
): Promise<PersonSchema> {
  const results = await client.invoke(BreadOperationName.EMPLOYEE_UPDATE, {
    breadId,
    payload: {
      '@type': 'Person',
      ...payload,
    },
  });

  if (results.rawPayload.success === false) {
    throw new Error('Bamboo HR Employee Update Failed', {
      cause: results.rawPayload,
    });
  }

  return results.payload;
}
```

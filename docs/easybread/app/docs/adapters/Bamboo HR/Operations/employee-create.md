---
sidebar_position: 1
sidebar_label: Employee Create
---

# Bamboo HR Employee Create

```ts
import { BreadOperationName } from '@easybread/operations';
import type { BambooHrEmployeeCreateOperation } from '@easybread/adapter-bamboo-hr';
import type { PersonSchema } from '@easybread/schemas';

export async function adapterBambooHrEmployeeCreate(
  breadId: string,
  payload: PersonSchema
): Promise<PersonSchema> {
  const results = await client.invoke<BambooHrEmployeeCreateOperation>({
    breadId,
    name: BreadOperationName.EMPLOYEE_CREATE,
    payload
  });

  if (results.rawPayload.success === false) {
    throw new Error('Bamboo HR Employee Create Failed', {
      cause: results.rawPayload
    });
  }

  return results.payload;
}
```

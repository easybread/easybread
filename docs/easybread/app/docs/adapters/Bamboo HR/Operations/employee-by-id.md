---
sidebar_position: 2
sidebar_label: Employee By Id
---

# Bamboo HR Employee By ID

Get one employee by id.

```ts
import { BreadOperationName } from '@easybread/operations';
import type { BambooHrEmployeeByIdOperation } from '@easybread/adapter-bamboo-hr';

export async function adapterBambooHrEmployeeById(
  breadId: string,
  identifier: string
): Promise<PersonSchema> {
  const results = await client.invoke<BambooHrEmployeeByIdOperation>({
    breadId,
    name: BreadOperationName.EMPLOYEE_BY_ID,
    params: { identifier }
  });

  if (results.rawPayload.success === false) {
    throw new Error('Bamboo HR Employee By Id Failed', {
      cause: results.rawPayload
    });
  }

  return results.payload;
}
```

---
sidebar_position: 4
sidebar_label: Employee Search
---

# Bamboo HR Employee Search

Note, that the pagination is not supported. It is the limitation of the [Bamboo HR API](https://documentation.bamboohr.com/reference/get-employees-directory-1).

```ts
import { BreadOperationName } from '@easybread/operations';
import type { BambooHrEmployeeSearchOperation } from '@easybread/adapter-bamboo-hr';
import type { PersonSchema } from '@easybread/schemas';

export async function adapterBambooHrEmployeeSearch(
  breadId: string,
  query: string
): Promise<PersonSchema[]> {
  const results = await client.invoke<BambooHrEmployeeSearchOperation>({
    breadId,
    name: BreadOperationName.EMPLOYEE_SEARCH,
    params: { query },
    pagination: { type: 'DISABLED' },
  });

  if (results.rawPayload.success === false) {
    throw new Error('Bamboo HR Employee Search Failed', {
      cause: results.rawPayload
    });
  }
  
  return results.payload;
}
```

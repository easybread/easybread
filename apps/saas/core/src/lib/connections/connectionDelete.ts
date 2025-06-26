import { and, eq } from 'drizzle-orm';
import { fromPromise } from 'neverthrow';

import { connections, saasdb } from 'saas-db';
import { ERR_CODE, errDbQueryFailed, errObject } from 'saas-errors';
import { takeFirstOrErr } from 'saas-neverthrow-util';

export function connectionDelete(id: string, orgId: string) {
  return fromPromise(
    saasdb
      .delete(connections)
      .where(and(eq(connections.id, id), eq(connections.organizationId, orgId)))
      .returning(),
    errDbQueryFailed,
  ).andThen(takeFirstOrErr(errObject(ERR_CODE.enum.DB_NOT_FOUND)));
}

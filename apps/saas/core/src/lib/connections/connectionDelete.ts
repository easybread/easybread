import { and, eq } from 'drizzle-orm';
import { fromPromise } from 'neverthrow';

import { DB_ERROR, errDbQueryFailed, errObject } from 'saas-errors';
import { takeFirstOrErr } from 'saas-neverthrow-util';
import { connections, db } from 'saas-pg';

export function connectionDelete(id: string, orgId: string) {
  return fromPromise(
    db
      .delete(connections)
      .where(and(eq(connections.id, id), eq(connections.organizationId, orgId)))
      .returning(),
    errDbQueryFailed,
  ).andThen(takeFirstOrErr(errObject(DB_ERROR.NOT_FOUND)));
}

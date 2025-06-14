import { eq } from 'drizzle-orm';
import { fromPromise } from 'neverthrow';

import { DB_ERROR, errDbQueryFailed, errObject } from 'saas-errors';
import { takeFirstOrErr } from 'saas-neverthrow-util';
import { connections, db } from 'saas-pg';

export function connectionById(connectionId: string) {
  return fromPromise(
    db.select().from(connections).where(eq(connections.id, connectionId)),
    errDbQueryFailed,
  ).andThen(takeFirstOrErr(errObject(DB_ERROR.NOT_FOUND)));
}

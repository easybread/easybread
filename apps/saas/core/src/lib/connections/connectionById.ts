import { eq } from 'drizzle-orm';
import { fromPromise } from 'neverthrow';

import { connections, saasdb } from 'saas-db';
import { ERR_CODE, errDbQueryFailed, errObject } from 'saas-errors';
import { takeFirstOrErr } from 'saas-neverthrow-util';

export function connectionById(connectionId: string) {
  return fromPromise(
    saasdb.select().from(connections).where(eq(connections.id, connectionId)),
    errDbQueryFailed,
  ).andThen(takeFirstOrErr(errObject(ERR_CODE.enum.DB_NOT_FOUND)));
}

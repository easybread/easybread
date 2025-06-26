import { and, eq } from 'drizzle-orm';
import { fromPromise } from 'neverthrow';

import { connections, saasdb } from 'saas-db';
import type { ConnectionSettingsJsonb } from 'saas-db/types';
import { ERR_CODE, errDbQueryFailed, errObject } from 'saas-errors';
import { takeFirstOrErr } from 'saas-neverthrow-util';

export function connectionSettingsUpdate(
  id: string,
  orgId: string,
  settings: ConnectionSettingsJsonb,
) {
  return fromPromise(
    saasdb
      .update(connections)
      .set({ settings, isConnected: !!settings })
      .where(and(eq(connections.id, id), eq(connections.organizationId, orgId)))
      .returning(),
    errDbQueryFailed,
  ).andThen(takeFirstOrErr(errObject(ERR_CODE.enum.DB_NOT_FOUND)));
}

import { eq } from 'drizzle-orm';
import { fromPromise } from 'neverthrow';

import { connections, saasdb } from 'saas-db';

import { errDbQueryFailed } from 'saas-errors';

export function connectionListByOrg(orgId: string) {
  return fromPromise(
    saasdb
      .select()
      .from(connections)
      .where(eq(connections.organizationId, orgId)),
    errDbQueryFailed,
  );
}

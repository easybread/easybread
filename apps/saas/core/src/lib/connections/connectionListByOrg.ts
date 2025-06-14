import { eq } from 'drizzle-orm';
import { fromPromise } from 'neverthrow';

import { errDbQueryFailed } from 'saas-errors';
import { connections, db } from 'saas-pg';

export function connectionListByOrg(orgId: string) {
  return fromPromise(
    db.select().from(connections).where(eq(connections.organizationId, orgId)),
    errDbQueryFailed,
  );
}

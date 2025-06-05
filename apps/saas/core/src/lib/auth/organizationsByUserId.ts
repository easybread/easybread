import { eq } from 'drizzle-orm';
import { fromPromise, ok } from 'neverthrow';

import { errDbQueryFailed, errLog, errLogAndReturn } from 'saas-errors';
import { db, usersToOrganizations } from 'saas-pg';

export const organizationsByUserId = (userId: string) => {
  return fromPromise(
    db
      .select()
      .from(usersToOrganizations)
      .where(eq(usersToOrganizations.userId, userId)),

    errDbQueryFailed,
  )
    .orTee(errLog)
    .orElse(e => errLogAndReturn(e, ok([])))
    .andThen(orgs => {
      const defaultOrgId = orgs.find(o => o.isDefault)?.organizationId;
      const memberOf = orgs.map(o => o.organizationId);

      return ok({
        defaultOrgId,
        memberOf,
      });
    });
};

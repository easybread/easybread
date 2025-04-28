import { fromPromise } from 'neverthrow';

import { errDbQueryFailed, errLog } from 'saas-errors';
import { db, organizations, usersToOrganizations } from 'saas-pg';

export const organizationCreateDefault = async (userId: string) => {
  return fromPromise(
    db.transaction(async tx => {
      const [org] = await tx
        .insert(organizations)
        .values({ name: 'Default' })
        .returning();

      if (!org) tx.rollback();

      await tx.insert(usersToOrganizations).values({
        userId: userId,
        organizationId: org.id,
        isDefault: true,
      });
    }),

    errDbQueryFailed,
  ).orTee(errLog);
};

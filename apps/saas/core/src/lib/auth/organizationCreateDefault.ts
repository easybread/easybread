import { fromPromise } from 'neverthrow';

import { organizations, saasdb, usersToOrganizations } from 'saas-db';
import { errDbQueryFailed, errLog } from 'saas-errors';

export const organizationCreateDefault = async (userId: string) => {
  return fromPromise(
    saasdb.transaction(async tx => {
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

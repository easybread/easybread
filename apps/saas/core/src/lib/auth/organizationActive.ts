import { fromPromise } from 'neverthrow';

import { errDbQueryFailed } from 'saas-errors';
import { redis } from 'saas-redis';

export async function organizationActiveSet(
  userId: string,
  organizationId: string,
) {
  return fromPromise(
    redis.set(`active-organization:${userId}`, organizationId),
    errDbQueryFailed,
  );
}

export async function organizationActiveGet(userId: string) {
  return fromPromise(
    redis.get<string>(`active-organization:${userId}`),
    errDbQueryFailed,
  );
}

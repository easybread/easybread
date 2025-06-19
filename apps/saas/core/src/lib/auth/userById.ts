import { eq } from 'drizzle-orm';
import { fromPromise } from 'neverthrow';

import { saasdb, users } from 'saas-db';

import { DB_ERROR, errDbQueryFailed, errLog, errObject } from 'saas-errors';
import { takeFirstOrErr } from 'saas-neverthrow-util';

export async function userById(userId: string) {
  return fromPromise(
    saasdb.select().from(users).where(eq(users.id, userId)),
    errDbQueryFailed,
  )
    .orTee(errLog)
    .andThen(takeFirstOrErr(errObject(DB_ERROR.NOT_FOUND)));
}

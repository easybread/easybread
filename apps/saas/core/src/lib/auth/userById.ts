import { eq } from 'drizzle-orm';
import { fromPromise } from 'neverthrow';

import { DB_ERROR, errDbQueryFailed, errLog, errObject } from 'saas-errors';
import { takeFirstOrErr } from 'saas-neverthrow-util';
import { db, users } from 'saas-pg';

export async function userById(userId: string) {
  return fromPromise(
    db.select().from(users).where(eq(users.id, userId)),
    errDbQueryFailed,
  )
    .orTee(errLog)
    .andThen(takeFirstOrErr(errObject(DB_ERROR.NOT_FOUND)));
}

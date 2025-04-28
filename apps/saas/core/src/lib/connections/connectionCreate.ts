import { fromPromise } from 'neverthrow';

import { DB_ERROR, errDbQueryFailed, errLog, errObject } from 'saas-errors';
import { takeFirstOrErr } from 'saas-neverthrow-util';
import { connections, db } from 'saas-pg';
import type { PgConnectionInsert } from 'saas-pg/types';

export const connectionCreate = (data: PgConnectionInsert) => {
  return fromPromise(
    db.insert(connections).values([data]).returning(),
    errDbQueryFailed,
  )
    .andThen(takeFirstOrErr(errObject(DB_ERROR.UNEXPECTED_EMPTY_RETURN_ARRAY)))
    .orTee(errLog);
};

import { fromPromise } from 'neverthrow';

import { connections, saasdb } from 'saas-db';
import type { PgConnectionInsert } from 'saas-db/types';

import { DB_ERROR, errDbQueryFailed, errObject } from 'saas-errors';
import { takeFirstOrErr } from 'saas-neverthrow-util';

export const connectionCreate = (data: PgConnectionInsert) => {
  return fromPromise(
    saasdb.insert(connections).values([data]).returning(),
    errDbQueryFailed,
  ).andThen(takeFirstOrErr(errObject(DB_ERROR.UNEXPECTED_EMPTY_RETURN_ARRAY)));
};

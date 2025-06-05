import { DB_ERROR } from './DBError';
import { errObject } from './errObject';

export function errDbQueryFailed(cause: unknown) {
  return errObject(DB_ERROR.QUERY_FAILED, cause);
}

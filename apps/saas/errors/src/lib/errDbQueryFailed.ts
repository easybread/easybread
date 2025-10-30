import { ERR_CODE } from './ErrCode';
import { errObject } from './errObject';

export function errDbQueryFailed(cause: unknown) {
  return errObject(ERR_CODE.enum.DB_QUERY_FAILED, cause);
}

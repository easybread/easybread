import { errLog } from './errLog';

export function errLogAndReturn<T>(err: unknown, result: T): T {
  errLog(err);
  return result;
}

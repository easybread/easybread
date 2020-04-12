import { FetchResult } from './FetchResult';
import { HookReturnThreeElements } from './HttpHookReturnTuple';
import { RefetchFunction } from './RefetchFunction';
import { RequestDataSetter } from './RequestDataSetter';

export type UsePostReturn<TData, TResult> = HookReturnThreeElements<
  FetchResult<TResult>,
  RequestDataSetter<TData>,
  RefetchFunction
>;

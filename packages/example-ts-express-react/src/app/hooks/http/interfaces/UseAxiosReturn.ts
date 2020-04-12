import { FetchResult } from './FetchResult';
import { HookReturnThreeElements } from './HttpHookReturnTuple';
import { RefetchFunction } from './RefetchFunction';
import { RequestConfigSetter } from './RequestConfigSetter';

export type UseAxiosReturn<T> = HookReturnThreeElements<
  FetchResult<T>,
  RequestConfigSetter,
  RefetchFunction
>;

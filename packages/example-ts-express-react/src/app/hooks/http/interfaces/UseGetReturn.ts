import { FetchFunction } from './FetchFunction';
import { FetchResult } from './FetchResult';
import { HookReturnThreeElements } from './HttpHookReturnTuple';
import { RefetchFunction } from './RefetchFunction';

export type UseGetReturn<TResult> = HookReturnThreeElements<
  FetchResult<TResult>,
  FetchFunction,
  RefetchFunction
>;

import { FetchResult } from './FetchResult';
import { HookReturnTwoElements } from './HttpHookReturnTuple';
import { RefetchFunction } from './RefetchFunction';

export type UseGetReturn<TResult> = HookReturnTwoElements<
  FetchResult<TResult>,
  RefetchFunction
>;

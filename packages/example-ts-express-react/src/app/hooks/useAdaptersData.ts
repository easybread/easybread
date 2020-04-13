import { useEffect } from 'react';

import { AdaptersStateDto } from '../../dtos';
import { useGet } from './http';
import {
  FetchResult,
  HookReturnTwoElements,
  RefetchFunction
} from './http/interfaces';

export function useAdaptersData(): HookReturnTwoElements<
  FetchResult<AdaptersStateDto>,
  RefetchFunction
> {
  const [result, fetch, refetch] = useGet<AdaptersStateDto>('/api/adapters');

  useEffect(() => {
    fetch();
  }, []);

  return [result, refetch];
}

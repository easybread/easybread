import { useEffect } from 'react';

import { AdaptersStateDto } from '../../../../dtos';
import { useGet } from '../../../hooks/http';
import {
  FetchResult,
  HookReturnTwoElements,
  RefetchFunction
} from '../../../hooks/http/interfaces';

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

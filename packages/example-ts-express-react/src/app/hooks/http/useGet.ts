import { useEffect } from 'react';

import { HttpDoneCallback, UseGetReturn } from './interfaces';
import { useAxios } from './useAxios';

export function useGet<TResult>(
  url: string,
  callback: HttpDoneCallback,
  deps: any[] = []
): UseGetReturn<TResult> {
  const [result, requestConfigSetter, refetch] = useAxios<TResult>(callback);

  useEffect(() => {
    requestConfigSetter({
      url,
      method: 'GET'
    });
  }, deps);

  return [result, refetch];
}

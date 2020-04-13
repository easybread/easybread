import { noop } from 'lodash';
import { useCallback } from 'react';

import { FetchFunction, HttpDoneCallback, UseGetReturn } from './interfaces';
import { useAxios } from './useAxios';

export function useGet<TResult>(
  url: string,
  callback: HttpDoneCallback<TResult> = noop
): UseGetReturn<TResult> {
  const [result, requestConfigSetter, refetch] = useAxios<TResult>(callback);

  const fetchFunction: FetchFunction = useCallback(() => {
    requestConfigSetter({
      url,
      method: 'GET'
    });
  }, [requestConfigSetter, url]);

  return [result, fetchFunction, refetch];
}

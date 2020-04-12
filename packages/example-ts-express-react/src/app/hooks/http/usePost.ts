import { useCallback } from 'react';

import {
  HttpDoneCallback,
  RequestDataSetter,
  UsePostReturn
} from './interfaces';
import { useAxios } from './useAxios';

export function usePost<TData, TResult>(
  url: string,
  callback: HttpDoneCallback
): UsePostReturn<TData, TResult> {
  const [result, requestConfigSetter, refetch] = useAxios<TResult>(callback);

  const dataSetter: RequestDataSetter<TData> = useCallback(
    (data) => {
      requestConfigSetter({
        method: 'POST',
        url,
        data
      });
    },
    [requestConfigSetter, callback, url]
  );

  return [result, dataSetter, refetch];
}

import axios, { AxiosRequestConfig } from 'axios';
import { isEqual } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

import {
  FetchResult,
  HttpDoneCallback,
  RefetchFunction,
  RequestConfigSetter,
  UseAxiosReturn
} from './interfaces';

export function useAxios<TResult>(
  callback: HttpDoneCallback
): UseAxiosReturn<TResult> {
  const [result, setResult] = useState<FetchResult<TResult>>({
    data: null,
    idle: true,
    pending: false,
    error: false
  });

  const [config, setConfig] = useState<AxiosRequestConfig | null>(null);

  const configSetter: RequestConfigSetter = useCallback(
    (requestConfig: AxiosRequestConfig) => {
      if (!config || !isEqual(config, requestConfig)) setConfig(requestConfig);
    },
    [setConfig, config]
  );

  const refetch: RefetchFunction = useCallback(() => {
    setConfig({ ...config });
  }, [setConfig, config]);

  useEffect(() => {
    if (!config) return;

    setResult({
      data: null,
      idle: false,
      pending: true,
      error: false
    });

    axios
      .request<TResult>(config)
      .then((r) => {
        setResult({
          data: r.data,
          idle: false,
          error: false,
          pending: false
        });
        callback();
      })
      .catch(() => {
        setResult({
          data: null,
          idle: false,
          error: true,
          pending: false
        });
        callback();
      });
  }, [config, setResult, callback]);

  return [result, configSetter, refetch];
}

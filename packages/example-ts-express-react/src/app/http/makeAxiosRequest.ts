import axios, { AxiosRequestConfig } from 'axios';

export async function makeAxiosRequest<TResult>(
  config: AxiosRequestConfig
): Promise<TResult> {
  return axios.request<TResult>(config).then(r => r.data);
}

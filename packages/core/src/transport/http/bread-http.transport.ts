import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export class BreadHttpTransport {
  async request<T>(
    requestConfig: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return axios.request<T, AxiosResponse<T>>(requestConfig);
  }
}

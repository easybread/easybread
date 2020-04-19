import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export class BreadHttpTransport {
  async request<T>(
    requestConfig: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return axios
      .request<T, AxiosResponse<T>>(requestConfig)
      .then(r => {
        // eslint-disable-next-line no-console
        console.log('REQUEST FINISHED:\n%s', r.data);
        return r;
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log('REQUEST FAILED:\n%s', err.response?.data);
        throw err;
      });
  }
}

import axios, { AxiosRequestConfig, AxiosResponse, isAxiosError } from 'axios';

export class BreadHttpTransport {
  static isTooManyRequestsError(error: unknown): boolean {
    return isAxiosError(error) && error.response?.status === 429;
  }

  static isGatewayTimeoutError(error: unknown): boolean {
    return isAxiosError(error) && error.response?.status === 504;
  }

  static isUnavailableError(error: unknown): boolean {
    return isAxiosError(error) && error.response?.status === 503;
  }

  static isConflictError(error: unknown): boolean {
    return isAxiosError(error) && error.response?.status === 409;
  }

  static isInternalServerError(error: unknown): boolean {
    return isAxiosError(error) && error.response?.status === 500;
  }

  async request<T>(
    requestConfig: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return axios
      .request<T, AxiosResponse<T>>(requestConfig)
      .then((r) => {
        // eslint-disable-next-line no-console
        // console.log('REQUEST FINISHED:\n%s', r.data);
        return r;
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        // console.log('REQUEST FAILED:\n%s', err.response?.data);
        throw err;
      });
  }
}

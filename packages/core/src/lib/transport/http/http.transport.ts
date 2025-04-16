import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  isAxiosError,
} from 'axios';

import type { HttpTransportError } from './http.transport-error';

export class HttpTransport {
  static isTooManyRequestsError(error: unknown): boolean {
    return this.isHttpError(error) && this.getErrorStatus(error) === 429;
  }

  static isGatewayTimeoutError(error: unknown): boolean {
    return this.isHttpError(error) && this.getErrorStatus(error) === 504;
  }

  static isUnavailableError(error: unknown): boolean {
    return this.isHttpError(error) && this.getErrorStatus(error) === 503;
  }

  static isConflictError(error: unknown): boolean {
    return this.isHttpError(error) && this.getErrorStatus(error) === 409;
  }

  static isInternalServerError(error: unknown): boolean {
    return this.isHttpError(error) && this.getErrorStatus(error) === 500;
  }

  static isHttpError(error: unknown): error is HttpTransportError {
    return isAxiosError(error);
  }

  static getErrorStatus(error: HttpTransportError<any>): number {
    return error.response?.status ?? error.status ?? 500;
  }

  static getErrorData<T extends HttpTransportError<any>>(
    error: T,
  ): T extends HttpTransportError<infer TData> ? TData | undefined : never {
    return error.response?.data;
  }

  static getErrorMessage(error: HttpTransportError<any>): string {
    return error.message;
  }

  async request<T>(
    requestConfig: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return axios
      .request<T, AxiosResponse<T>>(requestConfig)
      .then(r => {
        // console.log('REQUEST FINISHED:\n%s', r.data);
        return r;
      })
      .catch(err => {
        // console.log('REQUEST FAILED:\n%s', err.response?.data);
        throw err;
      });
  }
}

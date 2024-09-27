import axios from 'axios';
import {
  type AxiosRequestConfig,
  type AxiosResponse,
  isAxiosError,
} from 'axios';
import type { BreadHttpTransportError } from './bread-http.transport-error';

export class BreadHttpTransport {
  static isTooManyRequestsError(error: unknown): boolean {
    return isAxiosError(error) && this.getErrorStatus(error) === 429;
  }

  static isGatewayTimeoutError(error: unknown): boolean {
    return isAxiosError(error) && this.getErrorStatus(error) === 504;
  }

  static isUnavailableError(error: unknown): boolean {
    return isAxiosError(error) && this.getErrorStatus(error) === 503;
  }

  static isConflictError(error: unknown): boolean {
    return isAxiosError(error) && this.getErrorStatus(error) === 409;
  }

  static isInternalServerError(error: unknown): boolean {
    return isAxiosError(error) && this.getErrorStatus(error) === 500;
  }

  static isHttpError(error: unknown): error is BreadHttpTransportError<any> {
    return isAxiosError(error);
  }

  static getErrorStatus(error: BreadHttpTransportError<any>): number {
    return error.response?.status ?? error.status ?? 500;
  }

  static getErrorData<T extends BreadHttpTransportError<any>>(
    error: T
  ): T extends BreadHttpTransportError<infer TData>
    ? TData | undefined
    : never {
    return error.response?.data;
  }

  static getErrorMessage(error: BreadHttpTransportError<any>): string {
    return error.message;
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

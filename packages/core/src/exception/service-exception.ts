import { AxiosError } from 'axios';

import { BreadException } from './bread-exception';

// TODO: improve and refactor
export class ServiceException extends BreadException {
  provider: string;
  originalError: Error | { status?: number; message: string } | string;

  constructor(provider: string, error: Error | AxiosError | string) {
    // TODO: better error format
    const message =
      typeof error === 'string' ? error : error.message ?? error.toString();

    super(`${provider}: ${message}`);

    this.provider = provider;
    this.originalError = error;
  }
}

import { AxiosError } from 'axios';

import { BreadException } from './bread-exception';

// TODO: improve and refactor
export class ServiceException extends BreadException {
  provider: string;
  originalError?: Error | AxiosError;

  constructor(provider: string, message: string, error?: Error | AxiosError) {
    super(`${provider}: ${message}`);

    this.provider = provider;
    this.originalError = error;
  }
}

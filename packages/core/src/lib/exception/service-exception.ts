import { BreadException } from './bread-exception';

export class ServiceException extends BreadException {
  static fromUnknown(provider: string, error: unknown): ServiceException {
    if (this.isServiceException(error)) {
      return error.provider === provider
        ? error
        : new ServiceException(provider, error.message, error);
    }

    if (typeof error === 'string') {
      return new ServiceException(provider, error);
    }

    if (error instanceof Error) {
      return new ServiceException(provider, error.message, error);
    }

    if (error) {
      return new ServiceException(provider, `${error}`);
    }

    return new ServiceException(provider, 'Unknown error');
  }

  static isServiceException(value: unknown): value is ServiceException {
    return value instanceof ServiceException;
  }

  readonly provider: string;

  constructor(provider: string, message: string, error?: unknown) {
    super(`${provider}: ${message}`, { cause: error });

    this.provider = provider;
  }
}

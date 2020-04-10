import { BreadException } from './bread-exception';

// TODO: improve and refactor
export class ServiceException extends BreadException {
  provider: string;
  originalError: Error | { status?: number; message: string };

  constructor(
    provider: string,
    error: Error | { status?: number; message: string }
  ) {
    // TODO: better error format
    super(`${provider}: ${error.message ?? error.toString()}`);
    this.provider = provider;
    this.originalError = error;
  }
}

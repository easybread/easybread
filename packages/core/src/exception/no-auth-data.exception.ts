import { BreadException } from './bread-exception';

export class NoAuthDataException extends BreadException {
  constructor(breadId: string) {
    super(`no auth data in the state for user ${breadId}`);
  }
}

import { BreadException } from './bread-exception';

export class AuthAttemptTokenUndefinedException extends BreadException {
  constructor(breadId: string) {
    super(`Auth attempt token is undefined for ${breadId}.`);
  }
}

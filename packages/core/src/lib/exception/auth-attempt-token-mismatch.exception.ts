import { BreadException } from './bread-exception';

export class AuthAttemptTokenMismatchException extends BreadException {
  constructor(breadId: string) {
    super(`Auth attempt token mismatch for ${breadId}`);
  }
}

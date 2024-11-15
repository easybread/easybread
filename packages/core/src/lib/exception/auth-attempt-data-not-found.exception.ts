import { BreadException } from './bread-exception';

export class AuthAttemptDataNotFoundException extends BreadException {
  constructor(breadId: string) {
    super(`Auth attempt data for ${breadId} not found`);
  }
}

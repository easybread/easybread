import { BreadException } from './bread-exception';

export class ValidationFailedException extends BreadException {
  issues: string[];
  constructor(issues: string[]) {
    super('Validation failed');
    this.issues = issues;
  }
}

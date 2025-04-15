import { BreadException } from './bread-exception';

export class NotImplementedException extends BreadException {
  constructor(operation: string) {
    super(`${operation} is not implemented`);
  }
}

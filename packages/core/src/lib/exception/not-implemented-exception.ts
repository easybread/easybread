import { BreadException } from './bread-exception';

export class NotImplementedException extends BreadException {
  constructor() {
    super('NOT_IMPLEMENTED');
  }
}

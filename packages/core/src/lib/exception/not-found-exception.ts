import { BreadException } from './bread-exception';

export class NotFoundException extends BreadException {
  constructor() {
    super('Not found');
  }
}

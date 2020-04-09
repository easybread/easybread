import { BreadServiceAdapter } from '../../service-adapter';
import { BreezyAuthStrategy } from './breezy.auth-strategy';
import { BREEZY_PROVIDER } from './breezy.constants';
import { BreezyOperation } from './breezy.operation';
import {
  BreezyAuthenticateHandler,
  BreezyCompanySearchHandler
} from './handlers';

export class BreezyAdapter extends BreadServiceAdapter<
  BreezyOperation,
  BreezyAuthStrategy
> {
  provider = BREEZY_PROVIDER;

  constructor() {
    super();
    this.registerOperationHandlers(
      BreezyAuthenticateHandler,
      BreezyCompanySearchHandler
    );
  }
}

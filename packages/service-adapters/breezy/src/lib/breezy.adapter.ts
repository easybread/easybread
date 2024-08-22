import { BreadServiceAdapter } from '@easybread/core';

import { BreezyAuthStrategy } from './breezy.auth-strategy';
import { BREEZY_PROVIDER_NAME } from './breezy.constants';
import { BreezyOperation } from './breezy.operation';
import {
  BreezyAuthenticateHandler,
  BreezyCompanySearchHandler
} from './handlers';

export class BreezyAdapter extends BreadServiceAdapter<
  BreezyOperation,
  BreezyAuthStrategy
> {
  provider = BREEZY_PROVIDER_NAME;

  constructor() {
    super();
    this.registerOperationHandlers(
      BreezyAuthenticateHandler,
      BreezyCompanySearchHandler
    );
  }
}

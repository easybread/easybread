import { ServiceAdapter } from '@easybread/core';

import { BreezyAuthStrategy } from './breezy.auth-strategy';
import { BREEZY_PROVIDER_NAME } from './breezy.constants';
import {
  BreezyAuthBasicSetHandler,
  BreezyOrganizationSearchHandler,
} from './handlers';

const HANDLER_MAP = {
  [BreezyOrganizationSearchHandler.name]: BreezyOrganizationSearchHandler,
  [BreezyAuthBasicSetHandler.name]: BreezyAuthBasicSetHandler,
} as const;

export class BreezyAdapter extends ServiceAdapter<
  typeof HANDLER_MAP,
  BreezyAuthStrategy
> {
  provider = BREEZY_PROVIDER_NAME;

  constructor(authStrategy: BreezyAuthStrategy) {
    super(HANDLER_MAP, authStrategy, null);
  }
}

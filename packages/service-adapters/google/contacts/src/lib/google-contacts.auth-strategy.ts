import { BreadStateAdapter } from '@easybread/core';
import {
  GoogleCommonAuthStrategyOptions,
  GoogleCommonOauth2AuthStrategy,
} from '@easybread/adapter-google-common';

import { GOOGLE_PROVIDER_NAME } from './google-contacts.constants';
import { GoogleContactsAuthScopes } from './interfaces';

export class GoogleContactsAuthStrategy extends GoogleCommonOauth2AuthStrategy<GoogleContactsAuthScopes> {
  constructor(
    state: BreadStateAdapter,
    options: GoogleCommonAuthStrategyOptions
  ) {
    super(state, GOOGLE_PROVIDER_NAME, options);
  }
}

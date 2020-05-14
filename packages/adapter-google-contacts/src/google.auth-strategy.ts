import { BreadStateAdapter } from '@easybread/core';
import {
  GoogleCommonAuthStrategyOptions,
  GoogleCommonOauth2AuthStrategy
} from '@easybread/google-common';

import { GOOGLE_PROVIDER_NAME } from './google.constants';
import { GoogleContactsAuthScopes } from './interfaces';

export class GoogleAuthStrategy extends GoogleCommonOauth2AuthStrategy<
  GoogleContactsAuthScopes
> {
  constructor(
    state: BreadStateAdapter,
    options: GoogleCommonAuthStrategyOptions
  ) {
    super(state, GOOGLE_PROVIDER_NAME, options);
  }
}

import {
  GoogleCommonAuthStrategyOptions,
  GoogleCommonOauth2AuthStrategy,
} from '@easybread/adapter-google-common';
import { StateAdapter } from '@easybread/core';

import { GOOGLE_CONTACTS_PROVIDER_NAME } from './google-contacts.constants';
import { GoogleContactsAuthScopes } from './interfaces';

export class GoogleContactsAuthStrategy extends GoogleCommonOauth2AuthStrategy<GoogleContactsAuthScopes> {
  constructor(state: StateAdapter, options: GoogleCommonAuthStrategyOptions) {
    super(state, GOOGLE_CONTACTS_PROVIDER_NAME, options);
  }
}

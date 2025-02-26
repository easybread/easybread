import {
  GoogleCommonAuthStrategyOptions,
  GoogleCommonOauth2AuthStrategy,
} from '@easybread/adapter-google-common';
import { BreadStateAdapter } from '@easybread/core';

import { GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME } from './google-admin-directory.constants';
import { GoogleAdminDirectoryAuthScope } from './interfaces';

export class GoogleAdminDirectoryAuthStrategy extends GoogleCommonOauth2AuthStrategy<GoogleAdminDirectoryAuthScope> {
  constructor(
    state: BreadStateAdapter,
    options: GoogleCommonAuthStrategyOptions,
  ) {
    super(state, GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME, options);
  }
}

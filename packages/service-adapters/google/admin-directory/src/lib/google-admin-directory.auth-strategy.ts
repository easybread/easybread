import { BreadStateAdapter } from '@easybread/core';
import {
  GoogleCommonAuthStrategyOptions,
  GoogleCommonOauth2AuthStrategy,
} from '@easybread/adapter-google-common';

import { GoogleAdminDirectoryAuthScope } from './interfaces';
import { GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME } from './google-admin-directory.constants';

export class GoogleAdminDirectoryAuthStrategy extends GoogleCommonOauth2AuthStrategy<GoogleAdminDirectoryAuthScope> {
  constructor(
    state: BreadStateAdapter,
    options: GoogleCommonAuthStrategyOptions
  ) {
    super(state, GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME, options);
  }
}

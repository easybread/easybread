import { BreadStateAdapter } from '@easybread/core';
import {
  GoogleCommonAuthStrategyOptions,
  GoogleCommonOauth2AuthStrategy
} from '@easybread/google-common';

import { GSUITE_ADMIN_PROVIDER_NAME } from './gsuite-admin.constants';
import { GsuiteAdminAuthScope } from './interfaces';

export class GsuiteAdminAuthStrategy extends GoogleCommonOauth2AuthStrategy<
  GsuiteAdminAuthScope
> {
  constructor(
    state: BreadStateAdapter,
    options: GoogleCommonAuthStrategyOptions
  ) {
    super(state, GSUITE_ADMIN_PROVIDER_NAME, options);
  }
}

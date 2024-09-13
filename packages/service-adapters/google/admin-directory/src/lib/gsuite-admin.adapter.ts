import { BreadServiceAdapter } from '@easybread/core';
import {
  GoogleCommonOauth2CompleteHandler,
  GoogleCommonOauth2StartHandler,
} from '@easybread/adapter-google-common';

import { GsuiteAdminAuthStrategy } from './gsuite-admin.auth-strategy';
import { GSUITE_ADMIN_PROVIDER_NAME } from './gsuite-admin.constants';
import { GsuiteAdminOperation } from './gsuite-admin.operation';
import {
  GsuiteAdminUserByIdHandler,
  GsuiteAdminUsersCreateHandler,
  GsuiteAdminUsersDeleteHandler,
  GsuiteAdminUsersSearchHandler,
  GsuiteAdminUsersUpdateHandler,
} from './handlers';

export class GsuiteAdminAdapter extends BreadServiceAdapter<
  GsuiteAdminOperation,
  GsuiteAdminAuthStrategy
> {
  provider = GSUITE_ADMIN_PROVIDER_NAME;

  constructor() {
    super();
    this.registerOperationHandlers(
      GoogleCommonOauth2StartHandler,
      GoogleCommonOauth2CompleteHandler,
      GsuiteAdminUsersSearchHandler,
      GsuiteAdminUserByIdHandler,
      GsuiteAdminUsersUpdateHandler,
      GsuiteAdminUsersCreateHandler,
      GsuiteAdminUsersDeleteHandler
    );
  }
}

import { BreadServiceAdapter } from '@easybread/core';
import {
  GoogleCommonOauth2CompleteHandler,
  GoogleCommonOauth2StartHandler,
} from '@easybread/adapter-google-common';

import { GoogleAdminDirectoryAuthStrategy } from './google-admin-directory.auth-strategy';
import { GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME } from './google-admin-directory.constants';
import { GoogleAdminDirectoryOperation } from './google-admin-directory.operation';
import {
  GoogleAdminDirectoryUserByIdHandler,
  GoogleAdminDirectoryUsersCreateHandler,
  GoogleAdminDirectoryUsersDeleteHandler,
  GoogleAdminDirectoryUsersSearchHandler,
  GoogleAdminDirectoryUsersUpdateHandler,
} from './handlers';

export class GoogleAdminDirectoryAdapter extends BreadServiceAdapter<
  GoogleAdminDirectoryOperation,
  GoogleAdminDirectoryAuthStrategy
> {
  provider = GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME;

  constructor() {
    super();
    this.registerOperationHandlers(
      GoogleCommonOauth2StartHandler,
      GoogleCommonOauth2CompleteHandler,
      GoogleAdminDirectoryUsersSearchHandler,
      GoogleAdminDirectoryUserByIdHandler,
      GoogleAdminDirectoryUsersUpdateHandler,
      GoogleAdminDirectoryUsersCreateHandler,
      GoogleAdminDirectoryUsersDeleteHandler
    );
  }
}

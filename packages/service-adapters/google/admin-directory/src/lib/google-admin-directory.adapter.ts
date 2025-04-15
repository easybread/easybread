import {
  GoogleCommonAuthOauth2CompleteHandler,
  GoogleCommonAuthOauth2StartHandler,
} from '@easybread/adapter-google-common';
import { ServiceAdapter } from '@easybread/core';

import { GoogleAdminDirectoryAuthStrategy } from './google-admin-directory.auth-strategy';
import { GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME } from './google-admin-directory.constants';
import {
  GoogleAdminDirectoryUserByIdHandler,
  GoogleAdminDirectoryUsersCreateHandler,
  GoogleAdminDirectoryUsersDeleteHandler,
  GoogleAdminDirectoryUsersSearchHandler,
  GoogleAdminDirectoryUsersUpdateHandler,
} from './handlers';

const HANDLER_MAP = {
  [GoogleCommonAuthOauth2StartHandler.name]: GoogleCommonAuthOauth2StartHandler,
  [GoogleCommonAuthOauth2CompleteHandler.name]:
    GoogleCommonAuthOauth2CompleteHandler,

  [GoogleAdminDirectoryUsersSearchHandler.name]:
    GoogleAdminDirectoryUsersSearchHandler,
  [GoogleAdminDirectoryUserByIdHandler.name]:
    GoogleAdminDirectoryUserByIdHandler,
  [GoogleAdminDirectoryUsersUpdateHandler.name]:
    GoogleAdminDirectoryUsersUpdateHandler,
  [GoogleAdminDirectoryUsersCreateHandler.name]:
    GoogleAdminDirectoryUsersCreateHandler,
  [GoogleAdminDirectoryUsersDeleteHandler.name]:
    GoogleAdminDirectoryUsersDeleteHandler,
} as const;

export class GoogleAdminDirectoryAdapter extends ServiceAdapter<
  typeof HANDLER_MAP,
  GoogleAdminDirectoryAuthStrategy
> {
  provider = GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME;

  constructor(auth: GoogleAdminDirectoryAuthStrategy) {
    super(HANDLER_MAP, auth, null);
  }
}

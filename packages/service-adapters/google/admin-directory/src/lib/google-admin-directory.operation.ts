import {
  GoogleCommonOauth2CompleteOperation,
  GoogleCommonOauth2StartOperation,
} from '@easybread/adapter-google-common';

import {
  GoogleAdminDirectoryUsersByIdOperation,
  GoogleAdminDirectoryUsersCreateOperation,
  GoogleAdminDirectoryUsersDeleteOperation,
  GoogleAdminDirectoryUsersSearchOperation,
  GoogleAdminDirectoryUsersUpdateOperation,
} from './operations';
import type { GoogleAdminDirectoryAuthScope } from './interfaces';

export type GoogleAdminDirectoryOperation =
  | GoogleCommonOauth2CompleteOperation
  | GoogleCommonOauth2StartOperation<GoogleAdminDirectoryAuthScope>
  | GoogleAdminDirectoryUsersSearchOperation
  | GoogleAdminDirectoryUsersByIdOperation
  | GoogleAdminDirectoryUsersUpdateOperation
  | GoogleAdminDirectoryUsersCreateOperation
  | GoogleAdminDirectoryUsersDeleteOperation;

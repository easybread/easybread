import {
  GoogleCommonOauth2CompleteOperation,
  GoogleCommonOauth2StartOperation,
} from '@easybread/adapter-google-common';

import type { GoogleAdminDirectoryAuthScope } from './interfaces';
import {
  GoogleAdminDirectoryUsersByIdOperation,
  GoogleAdminDirectoryUsersCreateOperation,
  GoogleAdminDirectoryUsersDeleteOperation,
  GoogleAdminDirectoryUsersSearchOperation,
  GoogleAdminDirectoryUsersUpdateOperation,
} from './operations';

export type GoogleAdminDirectoryOperation =
  | GoogleCommonOauth2CompleteOperation
  | GoogleCommonOauth2StartOperation<GoogleAdminDirectoryAuthScope>
  | GoogleAdminDirectoryUsersSearchOperation
  | GoogleAdminDirectoryUsersByIdOperation
  | GoogleAdminDirectoryUsersUpdateOperation
  | GoogleAdminDirectoryUsersCreateOperation
  | GoogleAdminDirectoryUsersDeleteOperation;

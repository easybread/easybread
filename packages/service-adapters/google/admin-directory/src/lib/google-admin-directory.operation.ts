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

export type GoogleAdminDirectoryOperation =
  | GoogleCommonOauth2CompleteOperation
  | GoogleCommonOauth2StartOperation
  | GoogleAdminDirectoryUsersSearchOperation
  | GoogleAdminDirectoryUsersByIdOperation
  | GoogleAdminDirectoryUsersUpdateOperation
  | GoogleAdminDirectoryUsersCreateOperation
  | GoogleAdminDirectoryUsersDeleteOperation;

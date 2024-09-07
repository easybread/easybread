import {
  GoogleCommonOauth2CompleteOperation,
  GoogleCommonOauth2StartOperation,
} from '@easybread/adapter-google-common';

import {
  GsuiteAdminUsersByIdOperation,
  GsuiteAdminUsersCreateOperation,
  GsuiteAdminUsersDeleteOperation,
  GsuiteAdminUsersSearchOperation,
  GsuiteAdminUsersUpdateOperation,
} from './operations';

export type GsuiteAdminOperation =
  | GoogleCommonOauth2CompleteOperation
  | GoogleCommonOauth2StartOperation
  | GsuiteAdminUsersSearchOperation
  | GsuiteAdminUsersByIdOperation
  | GsuiteAdminUsersUpdateOperation
  | GsuiteAdminUsersCreateOperation
  | GsuiteAdminUsersDeleteOperation;

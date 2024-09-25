import {
  BreadOperationInputWithPayload,
  BreadOperationOutputWithPayload,
  BreadStandardOperation,
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GoogleAdminDirectoryOperationName } from '../google-admin-directory.operation-name';

export interface GoogleAdminDirectoryUsersDeleteOperation
  extends BreadStandardOperation<GoogleAdminDirectoryOperationName.USERS_DELETE> {
  input: BreadOperationInputWithPayload<
    GoogleAdminDirectoryOperationName.USERS_DELETE,
    PersonSchema
  >;

  output: BreadOperationOutputWithPayload<
    GoogleAdminDirectoryOperationName.USERS_DELETE,
    PersonSchema
  >;
}

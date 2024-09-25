import {
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawDataAndPayload,
  BreadStandardOperation,
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GoogleAdminDirectoryOperationName } from '../google-admin-directory.operation-name';
import { GoogleAdminDirectoryUser } from '../interfaces';

export interface GoogleAdminDirectoryUsersUpdateOperation
  extends BreadStandardOperation<GoogleAdminDirectoryOperationName.USERS_UPDATE> {
  input: BreadOperationInputWithPayload<
    GoogleAdminDirectoryOperationName.USERS_UPDATE,
    PersonSchema
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    GoogleAdminDirectoryOperationName.USERS_UPDATE,
    GoogleAdminDirectoryUser,
    PersonSchema
  >;
}

import {
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawDataAndPayload,
  BreadStandardOperation,
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GoogleAdminDirectoryOperationName } from '../google-admin-directory.operation-name';
import { GoogleAdminDirectoryUser } from '../interfaces';

export interface GoogleAdminDirectoryUsersCreateOperation
  extends BreadStandardOperation<GoogleAdminDirectoryOperationName.USERS_CREATE> {
  input: BreadOperationInputWithPayload<
    GoogleAdminDirectoryOperationName.USERS_CREATE,
    PersonSchema
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    GoogleAdminDirectoryOperationName.USERS_CREATE,
    GoogleAdminDirectoryUser,
    PersonSchema
  >;
}

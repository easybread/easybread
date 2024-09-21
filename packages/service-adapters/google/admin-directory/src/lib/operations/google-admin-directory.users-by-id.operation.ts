import {
  BreadOperationInputWithParams,
  BreadOperationOutputWithRawDataAndPayload,
  BreadStandardOperation,
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GoogleAdminDirectoryOperationName } from '../google-admin-directory.operation-name';
import { GoogleAdminDirectoryUser } from '../interfaces';

export interface GoogleAdminDirectoryUsersByIdOperation
  extends BreadStandardOperation<GoogleAdminDirectoryOperationName.USERS_BY_ID> {
  input: BreadOperationInputWithParams<
    GoogleAdminDirectoryOperationName.USERS_BY_ID,
    Pick<PersonSchema, 'identifier'>
  >;

  output: BreadOperationOutputWithRawDataAndPayload<
    GoogleAdminDirectoryOperationName.USERS_BY_ID,
    GoogleAdminDirectoryUser,
    PersonSchema
  >;
}

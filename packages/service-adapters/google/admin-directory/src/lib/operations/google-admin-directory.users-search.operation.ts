import {
  BreadCollectionOperation,
  BreadCollectionOperationInputWithParams,
  BreadCollectionOperationOutputWithRawDataAndPayload,
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GoogleAdminDirectoryOperationName } from '../google-admin-directory.operation-name';
import { GoogleAdminDirectoryUsersList } from '../interfaces';
import { GoogleAdminDirectoryUsersSearchOperationInputParams } from './google-admin-directory.users-search.operation.input-params';

export interface GoogleAdminDirectoryUsersSearchOperation
  extends BreadCollectionOperation<
    GoogleAdminDirectoryOperationName.USERS_SEARCH,
    'PREV_NEXT'
  > {
  input: BreadCollectionOperationInputWithParams<
    GoogleAdminDirectoryOperationName.USERS_SEARCH,
    GoogleAdminDirectoryUsersSearchOperationInputParams,
    'PREV_NEXT'
  >;
  output: BreadCollectionOperationOutputWithRawDataAndPayload<
    GoogleAdminDirectoryOperationName.USERS_SEARCH,
    GoogleAdminDirectoryUsersList,
    PersonSchema[],
    'PREV_NEXT'
  >;
}

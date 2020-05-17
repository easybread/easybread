import {
  BreadOperation,
  BreadOperationInputWithParams,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GsuiteAdminOperationName } from '../gsuite-admin.operation-name';
import { GsuiteAdminUsersList } from '../interfaces';
import { GsuiteAdminUsersSearchOperationInputParams } from './gsuite-admin.users-search.operation.input-params';

export interface GsuiteAdminUsersSearchOperation
  extends BreadOperation<GsuiteAdminOperationName.USERS_SEARCH> {
  input: BreadOperationInputWithParams<
    GsuiteAdminOperationName.USERS_SEARCH,
    GsuiteAdminUsersSearchOperationInputParams
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    GsuiteAdminOperationName.USERS_SEARCH,
    GsuiteAdminUsersList,
    PersonSchema[]
  >;
}

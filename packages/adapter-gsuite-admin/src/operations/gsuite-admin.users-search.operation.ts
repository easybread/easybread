import {
  BreadCollectionOperation,
  BreadCollectionOperationInputWithParams,
  BreadCollectionOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GsuiteAdminOperationName } from '../gsuite-admin.operation-name';
import { GsuiteAdminUsersList } from '../interfaces';
import { GsuiteAdminUsersSearchOperationInputParams } from './gsuite-admin.users-search.operation.input-params';

export interface GsuiteAdminUsersSearchOperation
  extends BreadCollectionOperation<GsuiteAdminOperationName.USERS_SEARCH> {
  input: BreadCollectionOperationInputWithParams<
    GsuiteAdminOperationName.USERS_SEARCH,
    GsuiteAdminUsersSearchOperationInputParams
  >;
  output: BreadCollectionOperationOutputWithRawDataAndPayload<
    GsuiteAdminOperationName.USERS_SEARCH,
    GsuiteAdminUsersList,
    PersonSchema[]
  >;
}

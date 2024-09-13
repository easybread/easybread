import {
  BreadCollectionOperation,
  BreadCollectionOperationInputWithParams,
  BreadCollectionOperationOutputWithRawDataAndPayload,
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GsuiteAdminOperationName } from '../gsuite-admin.operation-name';
import { GsuiteAdminUsersList } from '../interfaces';
import { GsuiteAdminUsersSearchOperationInputParams } from './gsuite-admin.users-search.operation.input-params';

export interface GsuiteAdminUsersSearchOperation
  extends BreadCollectionOperation<
    GsuiteAdminOperationName.USERS_SEARCH,
    'PREV_NEXT'
  > {
  input: BreadCollectionOperationInputWithParams<
    GsuiteAdminOperationName.USERS_SEARCH,
    GsuiteAdminUsersSearchOperationInputParams,
    'PREV_NEXT'
  >;
  output: BreadCollectionOperationOutputWithRawDataAndPayload<
    GsuiteAdminOperationName.USERS_SEARCH,
    GsuiteAdminUsersList,
    PersonSchema[],
    'PREV_NEXT'
  >;
}

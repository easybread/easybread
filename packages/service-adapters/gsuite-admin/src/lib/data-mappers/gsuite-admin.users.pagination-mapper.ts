import {
  BreadDataMapDefinition,
  BreadOperationInputPagination,
  BreadOperationOutputPagination,
  BreadPaginationMapper
} from '@easybread/core';

import {
  GsuiteAdminUsersList,
  GsuiteAdminUsersListPaginationParams
} from '../interfaces';

export class GsuiteAdminUsersPaginationMapper extends BreadPaginationMapper<
  GsuiteAdminUsersListPaginationParams,
  GsuiteAdminUsersList,
  'PREV_NEXT'
> {
  protected readonly toOutputPaginationMap: BreadDataMapDefinition<
    GsuiteAdminUsersList,
    BreadOperationOutputPagination<'PREV_NEXT'>
  > = {
    type: _ => 'PREV_NEXT',
    next: 'nextPageToken'
  };

  protected readonly toRemoteParamsMap: BreadDataMapDefinition<
    BreadOperationInputPagination<'PREV_NEXT'>,
    GsuiteAdminUsersListPaginationParams
  > = {
    pageToken: 'page'
  };
}

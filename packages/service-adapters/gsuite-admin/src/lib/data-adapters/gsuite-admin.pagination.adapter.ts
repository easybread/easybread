import {
  BreadOperationInputPagination,
  BreadOperationOutputPagination,
} from '@easybread/core';

import {
  GsuiteAdminUsersList,
  GsuiteAdminUsersListPaginationParams,
} from '../interfaces';
import { breadPaginationAdapter } from '@easybread/pagination-adapter';

export const gsuiteAdminPaginationAdapter = breadPaginationAdapter<
  BreadOperationInputPagination<'PREV_NEXT'>,
  BreadOperationOutputPagination<'PREV_NEXT'>,
  GsuiteAdminUsersListPaginationParams,
  GsuiteAdminUsersList
>({
  toExternalParams: {
    pageToken: (_) => {
      if (!_.page) throw new Error('page is not specified');
      return _.page.toString();
    },
  },

  toInternalData: {
    type: () => 'PREV_NEXT',
    next: 'nextPageToken',
  },
});

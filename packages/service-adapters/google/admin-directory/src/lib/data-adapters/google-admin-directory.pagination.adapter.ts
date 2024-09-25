import {
  BreadOperationInputPagination,
  BreadOperationOutputPagination,
} from '@easybread/core';

import {
  GoogleAdminDirectoryUsersList,
  GoogleAdminDirectoryUsersListPaginationParams,
} from '../interfaces';
import { breadPaginationAdapter } from '@easybread/pagination-adapter';

export const googleAdminDirectoryPaginationAdapter = breadPaginationAdapter<
  BreadOperationInputPagination<'PREV_NEXT'>,
  BreadOperationOutputPagination<'PREV_NEXT'>,
  GoogleAdminDirectoryUsersListPaginationParams,
  GoogleAdminDirectoryUsersList
>({
  toExternalParams: {
    pageToken: (_) => {
      if (!_.page) return '';
      return _.page.toString();
    },
  },

  toInternalData: {
    type: () => 'PREV_NEXT',
    next: 'nextPageToken',
  },
});

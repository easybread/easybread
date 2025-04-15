import { type PaginationInput, type PaginationOutput } from '@easybread/core';
import { breadPaginationAdapter } from '@easybread/pagination-adapter';

import {
  GoogleAdminDirectoryUsersList,
  GoogleAdminDirectoryUsersListPaginationParams,
} from '../interfaces';

export const googleAdminDirectoryPaginationAdapter = breadPaginationAdapter<
  PaginationInput<'CURSOR'>,
  PaginationOutput<'CURSOR'>,
  GoogleAdminDirectoryUsersListPaginationParams,
  GoogleAdminDirectoryUsersList & {
    prevPageToken?: string;
    currentPageToken: string;
  }
>({
  toExternalParams: {
    pageToken: _ => {
      return _.cursor?.toString() ?? '';
    },
    maxResults: 'limit',
  },

  toInternalData: {
    type: () => 'CURSOR',
    cursor: 'currentPageToken',
    prevCursor: 'NO_MAP',
    nextCursor: _ => _.nextPageToken ?? null,
  },
});

import { breadPaginationAdapter } from '@easybread/pagination-adapter';
import {
  BreadOperationInputPagination,
  BreadOperationOutputPagination,
} from '@easybread/core';
import {
  GoogleContactsFeedPaginationParams,
  GoogleContactsFeedResponse,
} from '../interfaces';

export const googleContactsPaginationAdapter = breadPaginationAdapter<
  BreadOperationInputPagination<'SKIP_COUNT'>,
  BreadOperationOutputPagination<'SKIP_COUNT'>,
  GoogleContactsFeedPaginationParams,
  GoogleContactsFeedResponse
>({
  toExternalParams: {
    'max-results': 'count',
    'start-index': (_) => _.skip + 1,
  },

  toInternalData: {
    type: () => 'SKIP_COUNT',
    count: (_) => Number(_.feed.openSearch$itemsPerPage.$t),
    skip: (_) => Number(_.feed.openSearch$startIndex.$t) - 1,
    totalCount: (_) => Number(_.feed.openSearch$totalResults.$t),
  },
});

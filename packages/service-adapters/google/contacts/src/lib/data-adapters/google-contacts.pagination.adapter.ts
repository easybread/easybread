import { type PaginationInput, type PaginationOutput } from '@easybread/core';
import { breadPaginationAdapter } from '@easybread/pagination-adapter';

import {
  GoogleContactsFeedPaginationParams,
  GoogleContactsFeedResponse,
} from '../interfaces';

export const googleContactsPaginationAdapter = breadPaginationAdapter<
  PaginationInput<'OFFSET'>,
  PaginationOutput<'OFFSET'>,
  GoogleContactsFeedPaginationParams,
  GoogleContactsFeedResponse
>({
  toExternalParams: {
    'max-results': _ => _.limit ?? 20,
    'start-index': _ => _.offset + 1,
  },

  toInternalData: {
    type: () => 'OFFSET' as const,
    offset: _ => Number(_.feed.openSearch$startIndex.$t) - 1,
    limit: _ => Number(_.feed.openSearch$itemsPerPage.$t),
    totalCount: _ => Number(_.feed.openSearch$totalResults.$t),
  },
});

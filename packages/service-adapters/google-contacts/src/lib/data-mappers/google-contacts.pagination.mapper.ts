import {
  BreadDataMapDefinition,
  BreadOperationInputPagination,
  BreadOperationOutputPagination,
  BreadPaginationMapper
} from '@easybread/core';

import {
  GoogleContactsFeedPaginationParams,
  GoogleContactsFeedResponse
} from '../interfaces';

export class GoogleContactsPaginationMapper extends BreadPaginationMapper<
  GoogleContactsFeedPaginationParams,
  GoogleContactsFeedResponse,
  'SKIP_COUNT'
> {
  protected readonly toOutputPaginationMap: BreadDataMapDefinition<
    GoogleContactsFeedResponse,
    BreadOperationOutputPagination<'SKIP_COUNT'>
  > = {
    type: _ => 'SKIP_COUNT',
    count: input => Number(input.feed.openSearch$itemsPerPage.$t),
    skip: input => Number(input.feed.openSearch$startIndex.$t) - 1,
    totalCount: input => Number(input.feed.openSearch$totalResults.$t)
  };

  protected readonly toRemoteParamsMap: BreadDataMapDefinition<
    BreadOperationInputPagination<'SKIP_COUNT'>,
    GoogleContactsFeedPaginationParams
  > = {
    'max-results': input => input.count,
    'start-index': input => input.skip + 1
  };
}

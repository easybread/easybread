import {
  BreadCollectionOperationInputPagination,
  BreadCollectionOperationOutputPagination,
  BreadDataMapDefinition,
  BreadPaginationMapper
} from '@easybread/core';

import {
  GoogleContactsFeedPaginationParams,
  GoogleContactsFeedResponse
} from '../interfaces';

export class GoogleContactsPaginationMapper extends BreadPaginationMapper<
  GoogleContactsFeedPaginationParams,
  GoogleContactsFeedResponse
> {
  protected readonly toOutputPaginationMap: BreadDataMapDefinition<
    GoogleContactsFeedResponse,
    BreadCollectionOperationOutputPagination
  > = {
    count: input => Number(input.feed.openSearch$itemsPerPage.$t),
    skip: input => Number(input.feed.openSearch$startIndex.$t) - 1,
    totalCount: input => Number(input.feed.openSearch$totalResults.$t)
  };

  protected readonly toRemoteParamsMap: BreadDataMapDefinition<
    BreadCollectionOperationInputPagination,
    GoogleContactsFeedPaginationParams
  > = {
    'max-results': input => input.count,
    'start-index': input => input.skip + 1
  };
}

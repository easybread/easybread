import {
  BreadDataMapDefinition,
  BreadOperationInputPagination,
  BreadOperationOutputPagination,
  BreadPaginationMapper
} from '@easybread/core';

import {
  RocketChatPaginationData,
  RocketChatPaginationParams
} from '../interfaces';

export class RocketChatPaginationMapper extends BreadPaginationMapper<
  RocketChatPaginationParams,
  RocketChatPaginationData,
  'SKIP_COUNT'
> {
  protected readonly toOutputPaginationMap: BreadDataMapDefinition<
    RocketChatPaginationData,
    BreadOperationOutputPagination<'SKIP_COUNT'>
  > = {
    type: _ => 'SKIP_COUNT',
    count: 'count',
    skip: 'offset',
    totalCount: 'total'
  };

  protected readonly toRemoteParamsMap: BreadDataMapDefinition<
    BreadOperationInputPagination<'SKIP_COUNT'>,
    RocketChatPaginationParams
  > = {
    count: 'count',
    offset: 'skip'
  };
}

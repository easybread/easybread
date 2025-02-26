import {
  BreadOperationInputPagination,
  BreadOperationOutputPagination,
} from '@easybread/core';
import { breadPaginationAdapter } from '@easybread/pagination-adapter';

import {
  RocketChatPaginationData,
  RocketChatPaginationParams,
} from '../interfaces';

export const rocketChatPaginationAdapter = breadPaginationAdapter<
  BreadOperationInputPagination<'SKIP_COUNT'>,
  BreadOperationOutputPagination<'SKIP_COUNT'>,
  RocketChatPaginationParams,
  RocketChatPaginationData
>({
  toExternalParams: { count: 'count', offset: 'skip' },
  toInternalData: {
    type: () => 'SKIP_COUNT',
    count: 'count',
    skip: 'offset',
    totalCount: 'total',
  },
});

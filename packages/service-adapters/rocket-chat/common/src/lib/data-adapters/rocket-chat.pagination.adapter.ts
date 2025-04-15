import { type PaginationInput, type PaginationOutput } from '@easybread/core';
import { breadPaginationAdapter } from '@easybread/pagination-adapter';

import {
  RocketChatPaginationData,
  RocketChatPaginationParams,
} from '../interfaces';

export const rocketChatPaginationAdapter = breadPaginationAdapter<
  PaginationInput<'OFFSET'>,
  PaginationOutput<'OFFSET'>,
  RocketChatPaginationParams,
  RocketChatPaginationData
>({
  toExternalParams: { count: _ => _.limit ?? 20, offset: 'offset' },
  toInternalData: {
    type: () => 'OFFSET' as const,
    limit: 'count',
    offset: 'offset',
    totalCount: 'total',
  },
});

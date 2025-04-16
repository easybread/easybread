import type { PaginationInput, PaginationOutput } from '@easybread/core';
import { NO_MAP } from '@easybread/data-mapper';
import { breadPaginationAdapter } from '@easybread/pagination-adapter';

import type { BreezyPagination } from '../interfaces';

export const breezyPaginationAdapter = breadPaginationAdapter<
  PaginationInput<'PAGE'>,
  PaginationOutput<'PAGE'>,
  BreezyPagination,
  { page: number; pageSize: number }
>({
  toExternalParams: {
    page: 'page',
    page_size: _ => Math.min(_.pageSize ?? 20, 50),
    sort: _ => 'created',
  },

  toInternalData: {
    type: () => 'PAGE',
    page: 'pageSize',
    pagesTotal: NO_MAP,
    pageSize: 'pageSize',
  },
});

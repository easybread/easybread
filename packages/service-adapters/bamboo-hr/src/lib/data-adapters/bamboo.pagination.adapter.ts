import { breadPaginationAdapter } from '@easybread/pagination-adapter';
import type {
  BreadOperationInputPagination,
  BreadOperationOutputPagination,
} from '@easybread/core';
import type {
  BambooApplicationList,
  BambooApplicationListQuery,
} from '../interfaces';

export const bambooPaginationAdapter = breadPaginationAdapter<
  BreadOperationInputPagination<'PREV_NEXT'>,
  BreadOperationOutputPagination<'PREV_NEXT'>,
  Pick<BambooApplicationListQuery, 'page'>,
  BambooApplicationList
>({
  toExternalParams: {
    page: (_) => {
      return extractPageNumber(_.page) ?? undefined;
    },
  },
  toInternalData: {
    type: () => 'PREV_NEXT',
    next: (_) => extractPageNumber(_.nextPageUrl) ?? undefined,
  },
});

const PAGE_REGEX = /page=(\d+)/;

function extractPageNumber(maybeUrl?: string | number | null) {
  if (typeof maybeUrl !== 'string' && typeof maybeUrl !== 'number') {
    return undefined;
  }

  if (typeof maybeUrl === 'number') {
    return Number.isNaN(maybeUrl) ? undefined : maybeUrl;
  }

  if (maybeUrl.includes('page=')) {
    return extractPageNumber(PAGE_REGEX.exec(maybeUrl)?.at(1));
  }

  return extractPageNumber(Number(maybeUrl));
}

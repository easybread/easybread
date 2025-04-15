import type { PaginationInput, PaginationOutput } from '@easybread/core';
import { breadPaginationAdapter } from '@easybread/pagination-adapter';

import type {
  BambooApplicationList,
  BambooApplicationListQuery,
} from '../interfaces';

export const bambooPaginationAdapter = breadPaginationAdapter<
  PaginationInput<'CURSOR'>,
  PaginationOutput<'CURSOR'>,
  Pick<BambooApplicationListQuery, 'page'>,
  BambooApplicationList & { currentPage: number }
>({
  toExternalParams: {
    page: _ => extractPageNumber(_.cursor),
  },
  toInternalData: {
    type: () => 'CURSOR',
    cursor: _ => _.currentPage.toString(),
    nextCursor: _ => extractPageNumber(_.nextPageUrl)?.toString() ?? null,
    prevCursor: _ => (_.currentPage >= 2 ? `${_.currentPage - 1}` : null),
    limit: 'NO_MAP',
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

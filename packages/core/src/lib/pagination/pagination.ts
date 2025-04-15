import { type ValueOf, enumObject } from '@easybread/common';

export const PAGINATION_TYPE = enumObject([
  'DISABLED',
  'CURSOR',
  'PAGE',
  'OFFSET',
] as const);

export type PaginationType = ValueOf<typeof PAGINATION_TYPE>;

export type PaginationInputMap = {
  [PAGINATION_TYPE.DISABLED]: {
    type: typeof PAGINATION_TYPE.DISABLED;
  };
  [PAGINATION_TYPE.CURSOR]: {
    type: typeof PAGINATION_TYPE.CURSOR;
    cursor?: string;
    limit?: number;
  };
  [PAGINATION_TYPE.PAGE]: {
    type: typeof PAGINATION_TYPE.PAGE;
    page: number;
    pageSize?: number;
  };
  [PAGINATION_TYPE.OFFSET]: {
    type: typeof PAGINATION_TYPE.OFFSET;
    offset: number;
    limit?: number;
  };
};

export type PaginationOutputMap = {
  [PAGINATION_TYPE.DISABLED]: {
    type: typeof PAGINATION_TYPE.DISABLED;
  };

  [PAGINATION_TYPE.CURSOR]: {
    type: typeof PAGINATION_TYPE.CURSOR;
    cursor: string;
    limit?: number;
    nextCursor: string | null;
    prevCursor: string | null;
  };

  [PAGINATION_TYPE.PAGE]: {
    type: typeof PAGINATION_TYPE.PAGE;
    page: number;
    pageSize: number;
    pagesTotal?: number;
  };

  [PAGINATION_TYPE.OFFSET]: {
    type: typeof PAGINATION_TYPE.OFFSET;
    offset: number;
    limit: number;
    totalCount?: number;
  };
};

export type PaginationInput<T extends PaginationType> = PaginationInputMap[T];
export type PaginationOutput<T extends PaginationType> = PaginationOutputMap[T];

import type { PaginationInputMap, PaginationOutputMap } from './pagination';

export type PaginationInputAny = PaginationInputMap[keyof PaginationInputMap];
export type PaginationOutputAny =
  PaginationOutputMap[keyof PaginationOutputMap];

export type inferPaginationType<
  T extends PaginationInputAny | PaginationOutputAny,
> = T['type'];

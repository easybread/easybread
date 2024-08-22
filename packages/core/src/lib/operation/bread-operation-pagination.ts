export type BreadOperationPaginationType =
  | 'SKIP_COUNT'
  | 'PREV_NEXT'
  | 'DISABLED';

export interface BreadOperationPaginationBase<
  TType extends BreadOperationPaginationType
> {
  type: TType;
}

export type BreadOperationDisabledPagination = BreadOperationPaginationBase<
  'DISABLED'
>;

export interface BreadOperationSkipCountInputPagination
  extends BreadOperationPaginationBase<'SKIP_COUNT'> {
  skip: number;
  count: number;
}

export interface BreadOperationSkipCountOutputPagination
  extends BreadOperationPaginationBase<'SKIP_COUNT'> {
  skip: number;
  count: number;
  totalCount: number;
}

export interface BreadOperationPrevNextInputPagination
  extends BreadOperationPaginationBase<'PREV_NEXT'> {
  page?: string | number;
}

export interface BreadOperationPrevNextOutputPagination
  extends BreadOperationPaginationBase<'PREV_NEXT'> {
  prev?: string | number;
  next?: string | number;
}

type BreadOperationInputPaginationUnion =
  | BreadOperationSkipCountInputPagination
  | BreadOperationPrevNextInputPagination
  | BreadOperationDisabledPagination;

export type BreadOperationInputPagination<
  TType extends BreadOperationPaginationType
> = Extract<
  BreadOperationInputPaginationUnion,
  BreadOperationPaginationBase<TType>
>;

type BreadOperationOutputPaginationUnion =
  | BreadOperationSkipCountOutputPagination
  | BreadOperationPrevNextOutputPagination
  | BreadOperationDisabledPagination;

export type BreadOperationOutputPagination<
  TType extends BreadOperationPaginationType
> = Extract<
  BreadOperationOutputPaginationUnion,
  BreadOperationPaginationBase<TType>
>;

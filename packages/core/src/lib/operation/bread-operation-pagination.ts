export type BreadOperationPaginationType =
  | 'SKIP_COUNT'
  | 'PREV_NEXT'
  | 'DISABLED';

export type BreadOperationPaginationBase<
  TType extends BreadOperationPaginationType
> = {
  type: TType;
};

export type BreadOperationDisabledPagination =
  BreadOperationPaginationBase<'DISABLED'>;

export type BreadOperationSkipCountInputPagination =
  BreadOperationPaginationBase<'SKIP_COUNT'> & {
    skip: number;
    count: number;
  };

export type BreadOperationSkipCountOutputPagination =
  BreadOperationPaginationBase<'SKIP_COUNT'> & {
    skip: number;
    count: number;
    totalCount: number;
  };

export type BreadOperationPrevNextInputPagination =
  BreadOperationPaginationBase<'PREV_NEXT'> & {
    page?: string | number;
  };

export type BreadOperationPrevNextOutputPagination =
  BreadOperationPaginationBase<'PREV_NEXT'> & {
    prev?: string | number;
    next?: string | number;
  };

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

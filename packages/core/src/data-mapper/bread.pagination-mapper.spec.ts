import {
  BreadCollectionOperationInputPagination,
  BreadCollectionOperationOutputPagination
} from '../operation';
import { BreadDataMapDefinition } from './bread.data-map-definition.interface';
import { BreadPaginationMapper } from './bread.pagination-mapper';

interface RemoteParams {
  page: number;
  pageSize: number;
}

interface RemoteData {
  entries: object[];
  page: number;
  pagesCount: number;
  pageSize: number;
}

class TestPaginationMapper extends BreadPaginationMapper<
  RemoteParams,
  RemoteData
> {
  protected readonly toOutputPaginationMap: BreadDataMapDefinition<
    RemoteData,
    BreadCollectionOperationOutputPagination
  > = {
    count: 'pageSize',
    totalCount: ({ pageSize, pagesCount }) => pageSize * pagesCount,
    skip: ({ pageSize, page }) => pageSize * page
  };

  protected readonly toRemoteParamsMap: BreadDataMapDefinition<
    BreadCollectionOperationInputPagination,
    RemoteParams
  > = {
    page: ({ count, skip }) => ~~(skip / count),
    pageSize: 'count'
  };
}

const testMapper = new TestPaginationMapper();

it(`should calculate remote params correctly`, () => {
  expect(
    testMapper.toRemoteParams({
      count: 20,
      skip: 0
    })
  ).toEqual({ page: 0, pageSize: 20 });

  expect(
    testMapper.toRemoteParams({
      count: 20,
      skip: 41
    })
  ).toEqual({ page: 2, pageSize: 20 });
});

it(`should calculate remote params correctly`, () => {
  expect(
    testMapper.toOutputPagination({
      page: 0,
      pageSize: 20,
      entries: [],
      pagesCount: 5
    })
  ).toEqual({
    count: 20,
    skip: 0,
    totalCount: 100
  });

  expect(
    testMapper.toRemoteParams({
      count: 20,
      skip: 41
    })
  ).toEqual({ page: 2, pageSize: 20 });
});

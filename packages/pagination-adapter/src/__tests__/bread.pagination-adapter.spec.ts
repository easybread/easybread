import { breadPaginationAdapter } from '../lib/bread.pagination-adapter';
type InternalParams = {
  skip: number;
  count: number;
};

type InternalData = {
  skip: number;
  count: number;
  totalCount: number;
};

type ExternalParams = {
  page: number;
  pageSize: number;
};

type ExternalData = {
  page: number;
  pageSize: number;
  totalCount: number;
};

const adapter = breadPaginationAdapter<
  InternalParams,
  InternalData,
  ExternalParams,
  ExternalData
>({
  toExternalParams: {
    page: (_) => ~~(_.skip / _.count) + 1,
    pageSize: 'count',
  },
  toInternalData: {
    skip: (_) => (_.page - 1) * _.pageSize,
    count: 'pageSize',
    totalCount: 'totalCount',
  },
});

it(`should map to external params correctly`, () => {
  expect(adapter.toExternalParams({ skip: 0, count: 20 })).toEqual({
    page: 1,
    pageSize: 20,
  });

  expect(
    adapter.toExternalParams({
      skip: 19,
      count: 20,
    })
  ).toEqual({ page: 1, pageSize: 20 } satisfies ExternalParams);

  expect(
    adapter.toExternalParams({
      skip: 20,
      count: 20,
    })
  ).toEqual({ page: 2, pageSize: 20 } satisfies ExternalParams);

  expect(
    adapter.toExternalParams({
      skip: 21,
      count: 20,
    })
  ).toEqual({ page: 2, pageSize: 20 } satisfies ExternalParams);
});

it(`should map to internal data correctly`, () => {
  expect(
    adapter.toInternalData({ page: 1, pageSize: 20, totalCount: 99 })
  ).toEqual({
    skip: 0,
    count: 20,
    totalCount: 99,
  });

  expect(
    adapter.toInternalData({ page: 2, pageSize: 20, totalCount: 99 })
  ).toEqual({
    skip: 20,
    count: 20,
    totalCount: 99,
  });

  expect(
    adapter.toInternalData({ page: 3, pageSize: 20, totalCount: 99 })
  ).toEqual({
    skip: 40,
    count: 20,
    totalCount: 99,
  });
});

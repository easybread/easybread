# pagination-adapter

Maps internal pagination params to external and external pagination response to internal.

**Example:**

```ts
import { breadPaginationAdapter } from '@easybread/pagination-adapter';

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

const paginationAdapter = breadPaginationAdapter<
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

paginationAdapter.toExternalParams({ skip: 0, count: 20 })

paginationAdapter.toInternalData({ page: 1, pageSize: 20, totalCount: 99 })

```

**Note:**

There are possible limitations, that are out of our control.

For example, if the internal data supposed to have `totalCount` 
and external API with page-based pagination returns`totalPagesCount` 
(not total count of all found items, which is a bad API design in general),
there is no way to calculate the `totalCount` correctly.

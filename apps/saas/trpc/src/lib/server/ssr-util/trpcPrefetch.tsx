import 'server-only';

import type { TRPCQueryOptions } from '@trpc/tanstack-react-query';

import { getQueryServerClient } from '../trpcServer';

export function trpcPrefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryServerClient();

  if (queryOptions.queryKey[1]?.type === 'infinite') {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}

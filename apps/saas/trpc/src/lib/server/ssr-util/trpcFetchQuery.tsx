import 'server-only';

import type { TRPCQueryOptions } from '@trpc/tanstack-react-query';

import { getQueryServerClient } from '../trpcServer';

export async function trpcFetchQuery<
  T extends ReturnType<TRPCQueryOptions<any>>,
>(queryOptions: T) {
  const queryClient = getQueryServerClient();

  if (queryOptions.queryKey[1]?.type === 'infinite') {
    await queryClient.fetchInfiniteQuery(queryOptions as any);
  } else {
    await queryClient.fetchQuery(queryOptions);
  }
}

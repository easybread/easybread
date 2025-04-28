import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { getQueryServerClient } from '../trpcServer';

export function TrpcHydrateClient(props: { children: ReactNode }) {
  const queryClient = getQueryServerClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

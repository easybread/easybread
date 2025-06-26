import { Suspense } from 'react';

import { TrpcHydrateClient, trpcPrefetch, trpcServer } from 'saas-trpc/server';
import { ConnectionsList, ConnectionsListLoading } from 'saas-ui';

export const dynamic = 'force-dynamic';

export default function ConnectionsPage() {
  trpcPrefetch(trpcServer.connections.list.queryOptions());
  return (
    <TrpcHydrateClient>
      <Suspense fallback={<ConnectionsListLoading />}>
        <ConnectionsList />
      </Suspense>
    </TrpcHydrateClient>
  );
}

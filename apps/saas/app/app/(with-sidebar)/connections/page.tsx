import { Suspense } from 'react';

import { TrpcHydrateClient, trpcPrefetch, trpcServer } from 'saas-trpc/server';
import { ConnectionsList } from 'saas-ui/components/ConnectionsList/ConnectionsList';
import { ConnectionsListLoading } from 'saas-ui/components/ConnectionsList/ConnectionsListLoading';

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

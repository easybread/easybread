import { Suspense } from 'react';

import { TrpcHydrateClient, trpcPrefetch, trpcServer } from 'saas-trpc/server';
import { ConnectionDetails, LoadingState } from 'saas-ui';

export default async function ConnectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  trpcPrefetch(trpcServer.connections.byId.queryOptions({ id }));

  return (
    <TrpcHydrateClient>
      <Suspense fallback={<LoadingState />}>
        <ConnectionDetails connectionId={id} />
      </Suspense>
    </TrpcHydrateClient>
  );
}

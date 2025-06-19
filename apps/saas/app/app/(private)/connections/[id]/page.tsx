import { TrpcHydrateClient, trpcPrefetch, trpcServer } from 'saas-trpc/server';
import { ConnectionDetails } from 'saas-ui/components/ConnectionDetails';

export default async function ConnectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  trpcPrefetch(trpcServer.connections.byId.queryOptions({ id }));

  return (
    <TrpcHydrateClient>
      <ConnectionDetails connectionId={id} />
    </TrpcHydrateClient>
  );
}

import { TrpcHydrateClient } from 'saas-trpc/server';

import { ClientComp } from './ClientComp';

export default async function Home() {
  return (
    <TrpcHydrateClient>
      <ClientComp />
    </TrpcHydrateClient>
  );
}

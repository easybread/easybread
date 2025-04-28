import type { PropsWithChildren } from 'react';

import {
  TrpcHydrateClient,
  trpcFetchQuery,
  trpcServer,
} from 'saas-trpc/server';
import { NavSidebar } from 'saas-ui/components/NavSidebar/NavSidebar';
import { PageHeader } from 'saas-ui/components/PageHeader/PageHeader';
import { SidebarInset, SidebarProvider } from 'saas-ui/shadcn/sidebar';

export default async function WithSidebarLayout(props: PropsWithChildren) {
  await trpcFetchQuery(trpcServer.auth.info.queryOptions());

  return (
    <TrpcHydrateClient>
      <SidebarProvider>
        <NavSidebar />
        <SidebarInset>
          <PageHeader />

          <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {props.children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TrpcHydrateClient>
  );
}

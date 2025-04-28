'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from 'saas-trpc';

import { ConnectionDeleteProvider } from './ConnectionDelete';
import { ConnectionsListAddDialog } from './ConnectionsListAddDialog';
import { ConnectionsListItemCard } from './ConnectionsListItemCard';

export function ConnectionsList() {
  const trpc = useTRPC();
  const query = useSuspenseQuery(trpc.connections.list.queryOptions());

  const connections = query.data?.data ?? [];

  return (
    <ConnectionDeleteProvider>
      <div className="@container flex h-full w-full flex-col gap-4">
        <div className="flex justify-center">
          <ConnectionsListAddDialog />
        </div>

        <div className="grid grid-cols-1 gap-2 @2xl:grid-cols-2 @5xl:grid-cols-3 @7xl:grid-cols-4">
          {connections?.map(c => (
            <ConnectionsListItemCard key={c.id} data={c} />
          ))}
        </div>
      </div>
    </ConnectionDeleteProvider>
  );
}

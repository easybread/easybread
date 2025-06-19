'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from 'saas-trpc';

import { ConnectionDetailsForm } from './ConnectionDetailsForm';

export function ConnectionDetails({ connectionId }: { connectionId: string }) {
  const trpc = useTRPC();
  const { data: connection } = useSuspenseQuery(
    trpc.connections.byId.queryOptions({ id: connectionId }),
  );

  return (
    <div className="flex flex-col gap-4">
      <ConnectionDetailsForm connection={connection} />
    </div>
  );
}

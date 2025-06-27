'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from 'saas-trpc';

import { ConnectionSettingsEdit } from '../settings/ConnectionSettingsEdit';

import { ConnectionDetailsDataModel } from './ConnectionDetailsDataModel';
import { ConnectionDetailsHeader } from './ConnectionDetailsHeader';

export function ConnectionDetails({ connectionId }: { connectionId: string }) {
  const trpc = useTRPC();
  const { data: connection } = useSuspenseQuery(
    trpc.connections.byId.queryOptions({ id: connectionId }),
  );

  return (
    <ConnectionSettingsEdit>
      <div className="flex flex-1 flex-col gap-4 pt-2">
        <ConnectionDetailsHeader connection={connection} />
        <ConnectionDetailsDataModel connection={connection} />
      </div>
    </ConnectionSettingsEdit>
  );
}

'use client';

import { useQuery } from '@tanstack/react-query';

import { useTRPC } from 'saas-trpc';

import { LoadingState } from '../LoadingState/LoadingState';

import { DataModelNoModelState } from './DataModelNoModelState';
import { DataModelVisualizer } from './DataModelVisualizer';

export function DataModel({ connectionId }: { connectionId: string }) {
  const trpc = useTRPC();

  const dataModel = useQuery(
    trpc.connections.dataModelFetch.queryOptions(
      { id: connectionId },
      {
        retry(failureCount, error) {
          if (error.data?.code === 'NOT_FOUND') {
            return false;
          }
          return failureCount < 2;
        },
      },
    ),
  );

  if (dataModel.isLoading) {
    return <LoadingState />;
  }

  if (dataModel.error && dataModel.error.data?.code === 'NOT_FOUND') {
    return <DataModelNoModelState connectionId={connectionId} />;
  }

  if (!dataModel.data?.def) {
    return (
      <div>No data model definition. Try to introspect the data source.</div>
    );
  }

  return <DataModelVisualizer dataModel={dataModel.data.def} />;
}

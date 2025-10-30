import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoaderIcon } from 'lucide-react';

import { useTRPC } from 'saas-trpc';

import { Button } from '../../shadcn/button';

export function DataModelNoModelState({
  connectionId,
}: {
  connectionId: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const introspect = useMutation(
    trpc.connections.dataModelIntrospectionStart.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.connections.dataModelFetch.queryKey({
            id: connectionId,
          }),
        });
      },
    }),
  );

  return (
    <div className="mt-[10%] flex flex-col items-center justify-center gap-4">
      <p className="text-center text-lg text-gray-500">
        No data model.
        <br />
        Introspect the data source to create one.
      </p>

      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => introspect.mutate({ connectionId })}
        disabled={introspect.isPending}
      >
        {introspect.isPending ? (
          <>
            <LoaderIcon className="h-4 w-4 animate-spin" size={16} />
            Introspecting...
          </>
        ) : (
          'Start introspection'
        )}
      </Button>
    </div>
  );
}

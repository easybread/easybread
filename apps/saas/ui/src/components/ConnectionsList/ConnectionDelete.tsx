'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';

import type { PgConnectionSelect } from 'saas-db/types';

import { useTRPC } from 'saas-trpc';

import { useToastPromiseControl } from '../../hooks/use-toast-promise-control';

import { ConnectionDeleteDialog } from './ConnectionDeleteDialog';
import type { ConnectionListQueryOutputData } from './ConnectionListQueryOutputData';

type ConnectionDeleteContextType = {
  connection: PgConnectionSelect | null;
  connectionDelete: (connection: PgConnectionSelect) => void;
  connectionDeleteInProgressIds: Set<string>;
  _dialogOpen: boolean;
  _confirm: () => void;
  _cancel: () => void;
};

const ConnectionDeleteContext = createContext<ConnectionDeleteContextType>(
  {} as ConnectionDeleteContextType,
);

export function ConnectionDeleteProvider(
  props: PropsWithChildren<{ onDeleteSettled?: () => void | Promise<void> }>,
) {
  const { children, onDeleteSettled = () => void 0 } = props;

  const tpc = useToastPromiseControl();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [connection, setConnection] = useState<PgConnectionSelect | null>(null);
  const [inProgress, setInProgress] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const listQueryKey = trpc.connections.list.queryKey();

  const addInProgress = (id: string) => {
    setInProgress(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const removeInProgress = (id: string) => {
    setInProgress(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const deleteMutation = useMutation(
    trpc.connections.delete.mutationOptions({
      onMutate: async ({ id }) => {
        addInProgress(id);

        await queryClient.cancelQueries({ queryKey: listQueryKey });
        const previousState = queryClient.getQueryData(listQueryKey);

        queryClient.setQueryData<ConnectionListQueryOutputData>(
          listQueryKey,
          state => ({ data: state?.data?.filter(i => i.id !== id) ?? [] }),
        );

        return { previousState };
      },

      onError: (_err, input, ctx) => {
        if (!ctx) return;
        tpc.reject(input.id);
        queryClient.setQueryData(listQueryKey, ctx.previousState);
      },

      onSuccess: (_data, input) => {
        tpc.resolve(input.id);
      },

      onSettled: async (_data, _err, input) => {
        await queryClient.invalidateQueries({ queryKey: listQueryKey });
        tpc.deref(input.id);
        removeInProgress(input.id);
        onDeleteSettled();
      },
    }),
  );

  const connectionDelete = (connection: PgConnectionSelect) => {
    setConnection(connection);
    setDialogOpen(true);
  };

  const confirm = () => {
    if (!connection) return;
    deleteMutation.mutate({ id: connection.id });
    tpc.register(connection.id, {
      loading: `Deleting ${connection.name}...`,
      success: 'Done!',
      error: `Failed to delete ${connection.name}`,
    });
    setConnection(null);
    setDialogOpen(false);
  };

  const cancel = () => {
    setDialogOpen(false);
    setConnection(null);
  };

  return (
    <ConnectionDeleteContext.Provider
      value={{
        connectionDeleteInProgressIds: inProgress,
        connectionDelete,
        connection,
        _cancel: cancel,
        _confirm: confirm,
        _dialogOpen: dialogOpen,
      }}
    >
      <ConnectionDeleteDialog />
      {children}
    </ConnectionDeleteContext.Provider>
  );
}

export function useConnectionDeleteContext() {
  const context = useContext(ConnectionDeleteContext);

  if (!context) {
    throw new Error(
      'useConnectionDeleteContext must be used inside ConnectionDeleteProvider',
    );
  }

  return context;
}

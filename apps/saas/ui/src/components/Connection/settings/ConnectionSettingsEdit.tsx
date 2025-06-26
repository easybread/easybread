'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useState } from 'react';

import type { DtoConnection, DtoConnectionSettingsUpdate } from 'saas-dto';
import { useTRPC } from 'saas-trpc';

import { ConnectionSettingsDialog } from './ConnectionSettingsDialog';

type ConnectionSettingsEditContextType = {
  connectionEdit: (connectionId: string) => void;
  _isLoading: boolean;
  _isSaving: boolean;
  _connection: DtoConnection | null;
  _connectionId: string | null;
  _dialogOpen: boolean;
  _closeDialog: () => void;
  _save: (data: Pick<DtoConnectionSettingsUpdate, 'settings' | 'name'>) => void;
  _cancel: () => void;
};

const ConnectionSettingsEditContext =
  createContext<ConnectionSettingsEditContextType | null>(null);

export function ConnectionSettingsEdit(props: { children: React.ReactNode }) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: connection, isLoading } = useQuery(
    trpc.connections.byId.queryOptions(
      { id: connectionId ?? '' },
      { enabled: !!connectionId },
    ),
  );

  const updateMutation = useMutation(
    trpc.connections.updateSettings.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.connections.pathKey() });
        closeDialog();
        setConnectionId(null);
      },
      onError: error => {
        console.error(error);
      },
    }),
  );

  const save = (
    data: Pick<DtoConnectionSettingsUpdate, 'settings' | 'name'>,
  ) => {
    if (!connectionId) return;
    updateMutation.mutate({ id: connectionId, ...data });
  };

  const closeDialog = () => setDialogOpen(false);
  const cancel = () => closeDialog();

  const connectionEdit = (id: string) => {
    setDialogOpen(true);
    setConnectionId(id);
  };

  return (
    <ConnectionSettingsEditContext.Provider
      value={{
        connectionEdit,
        _isLoading: isLoading,
        _isSaving: updateMutation.isPending,
        _connection: connection ?? null,
        _cancel: cancel,
        _save: save,
        _dialogOpen: dialogOpen,
        _connectionId: connectionId,
        _closeDialog: closeDialog,
      }}
    >
      {props.children}
      <ConnectionSettingsDialog />
    </ConnectionSettingsEditContext.Provider>
  );
}

export function useConnectionEdit() {
  const context = useContext(ConnectionSettingsEditContext);
  if (!context) {
    throw new Error(
      `useConnectionEdit must be used inside ConnectionSettingsEdit`,
    );
  }

  return context;
}

import { createContext, useContext, useState } from 'react';

import { ConnectionSettingsDialog } from './ConnectionSettingsDialog';

type ConnectionSettingsEditContextType = {
  connectionEdit: (connectionId: string) => void;
  _connectionId: string | null;
  _dialogOpen: boolean;
  _closeDialog: () => void;
  _save: () => void;
  _cancel: () => void;
};

const ConnectionSettingsEditContext = createContext(
  {} as ConnectionSettingsEditContextType,
);

export function ConnectionSettingsEdit() {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);

  const save = () => void 0;
  const cancel = () => void 0;
  const closeDialog = () => setDialogOpen(false);

  const connectionEdit = (id: string) => {
    setDialogOpen(true);
    setConnectionId(id);
  };

  return (
    <ConnectionSettingsEditContext.Provider
      value={{
        connectionEdit,
        _cancel: cancel,
        _save: save,
        _dialogOpen: dialogOpen,
        _connectionId: connectionId,
        _closeDialog: closeDialog,
      }}
    >
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

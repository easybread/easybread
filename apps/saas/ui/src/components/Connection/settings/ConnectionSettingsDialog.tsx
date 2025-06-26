import { Dialog, DialogContent } from '../../../shadcn/dialog';
import { LoadingState } from '../../LoadingState/LoadingState';

import { useConnectionEdit } from './ConnectionSettingsEdit';
import { ConnectionSettingsForm } from './ConnectionSettingsForm';

export function ConnectionSettingsDialog() {
  const { _dialogOpen, _closeDialog, _connection, _isLoading } =
    useConnectionEdit();

  return (
    <Dialog open={_dialogOpen} onOpenChange={open => !open && _closeDialog()}>
      <DialogContent>
        {_isLoading && <LoadingState showTitle={true} showDescription={true} />}
        {!_isLoading && _connection && (
          <ConnectionSettingsForm connection={_connection} />
        )}
        {!_isLoading && !_connection && <div>No connection selected</div>}
      </DialogContent>
    </Dialog>
  );
}

import { Dialog, DialogContent } from '../../shadcn/dialog';

import { ConnectionSettingsForm } from './ConnectionSettingsForm';

export function ConnectionSettingsDialog() {
  return (
    <Dialog>
      <DialogContent>
        <ConnectionSettingsForm connectionType={'DB_PG'} />
      </DialogContent>
    </Dialog>
  );
}

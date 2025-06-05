'use client';

import { useCallback, useState } from 'react';

import { Button } from '../../shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../shadcn/dialog';

import { ConnectionsListAddForm } from './ConnectionsListAddForm';

export function ConnectionsListAddDialog() {
  const [open, setOpen] = useState(false);
  const onDone = useCallback(() => setOpen(false), [setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Connection</Button>
      </DialogTrigger>

      <DialogContent className="max-w-full sm:max-w-md lg:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a Connection</DialogTitle>
          <DialogDescription>
            A Connection allows you to read and write to the connected
            datasource.
          </DialogDescription>
        </DialogHeader>

        <ConnectionsListAddForm callback={onDone} />
      </DialogContent>
    </Dialog>
  );
}

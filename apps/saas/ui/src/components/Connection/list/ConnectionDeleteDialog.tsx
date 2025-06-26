'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../shadcn/alert-dialog';

import { useConnectionDeleteContext } from './ConnectionDelete';

export function ConnectionDeleteDialog() {
  const { connection, _dialogOpen, _confirm, _cancel } =
    useConnectionDeleteContext();

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) _cancel();
  };

  return (
    <AlertDialog open={_dialogOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="md:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Sure you want to delete <b>"{connection?.name}"</b> connection?
            <br />
            This action can not be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex items-center gap-4">
            <AlertDialogCancel onClick={_cancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={_confirm}>Delete</AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import { LoaderPinwheel } from 'lucide-react';

export function LoadingOverlay({
  isLoading,
  message,
}: {
  isLoading: boolean;
  message?: string;
}) {
  if (!isLoading) return null;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
      <div className="absolute inset-0.5 rounded-md bg-zinc-700 opacity-10" />
      {message ? <b>{message}</b> : null}
      <LoaderPinwheel className="animate-spin" />
    </div>
  );
}

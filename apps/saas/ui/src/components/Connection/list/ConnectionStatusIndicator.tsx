import { Power } from 'lucide-react';

import { cn } from '../../../lib/utils';

export function ConnectionStatusIndicator({
  onConnectClick,
  isConnected,
}: {
  onConnectClick: () => void;
  isConnected: boolean;
}) {
  return (
    <div
      className="gap group flex cursor-pointer items-center gap-1"
      onClick={() => !isConnected && onConnectClick()}
    >
      <Power
        style={{ strokeWidth: 3 }}
        className={cn('size-5 animate-pulse', {
          'text-orange-500': !isConnected,
          'text-lime-600': isConnected,
        })}
      />
    </div>
  );
}

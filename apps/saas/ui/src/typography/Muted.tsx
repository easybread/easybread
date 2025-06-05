import type { PropsWithChildren } from 'react';

import { cn } from '../lib/utils';

export function Muted(props: PropsWithChildren<{ className?: string }>) {
  return (
    <p className={cn('text-sm text-muted-foreground', props.className)}>
      {props.children}
    </p>
  );
}

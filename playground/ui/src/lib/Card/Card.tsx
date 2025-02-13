import { clsx } from 'clsx';
import type { PropsWithChildren } from 'react';

export type CardProps = PropsWithChildren<{ className?: string }>;
export function Card(props: CardProps) {
  return (
    <div
      className={clsx(
        'flex flex-col overflow-hidden rounded-lg bg-white p-4 shadow-md',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}

import type { PropsWithChildren } from 'react';
import { clsx } from 'clsx';

export type CardProps = PropsWithChildren<{ className?: string }>;
export function Card(props: CardProps) {
  return (
    <div
      className={clsx(
        'flex flex-col p-4 bg-white rounded-lg shadow-md overflow-hidden',
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

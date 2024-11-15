import { type PropsWithChildren } from 'react';
import { clsx } from 'clsx';

export function Pill(props: PropsWithChildren<{ className?: string }>) {
  const { className } = props;

  return (
    <div
      className={clsx(
        `bg-amber-200 text-gray-900 px-2 py-0.5 text-xs rounded-full`,
        className
      )}
    >
      {props.children}
    </div>
  );
}

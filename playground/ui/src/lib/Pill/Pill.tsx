import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';

export function Pill(props: PropsWithChildren<{ className?: string }>) {
  const { className } = props;

  return (
    <div
      className={clsx(
        `rounded-full bg-amber-200 px-2 py-0.5 text-xs text-gray-900`,
        className,
      )}
    >
      {props.children}
    </div>
  );
}

import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonProps = {
  flex?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    children,
    flex = true,
    className = null,
    ...restProps
  } = props;
  return (
    <button
      className={clsx(
        `font-semibold shadow transition-colors duration-200 hover:shadow focus:ring-2
        focus:ring-offset-2 focus:outline-none`,
        {
          'flex items-center justify-center': flex,

          [`bg-gradient-to-br from-amber-200 to-amber-300 hover:from-amber-100
          hover:to-amber-200 focus:ring-amber-500`]: variant === 'primary',

          'bg-gray-200 hover:bg-amber-100 focus:ring-amber-500':
            variant === 'secondary',

          [`border border-gray-300 hover:bg-gradient-to-br hover:from-amber-100
          hover:to-amber-300 focus:ring-amber-500`]: variant === 'outline',

          'rounded px-2 py-1 text-sm': size === 'sm',
          'rounded-md px-4 py-2': size === 'md',
          'rounded-lg px-6 py-3 text-lg': size === 'lg',
        },
        className,
      )}
      {...restProps}
    >
      {children}
    </button>
  );
}

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

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
        'font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow',
        {
          'flex items-center justify-center': flex,

          'bg-amber-200 hover:bg-amber-100 focus:ring-amber-500':
            variant === 'primary',

          'bg-gray-200 hover:bg-amber-100 focus:ring-amber-500':
            variant === 'secondary',

          'border-gray-300 border hover:bg-amber-200 focus:ring-amber-500':
            variant === 'outline',
          'px-2 py-1 text-sm rounded': size === 'sm',
          'px-4 py-2 rounded-md': size === 'md',
          'px-6 py-3 text-lg rounded-lg': size === 'lg',
        },
        className
      )}
      {...restProps}
    >
      {children}
    </button>
  );
}

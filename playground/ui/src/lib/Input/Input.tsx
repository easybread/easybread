import { clsx } from 'clsx';
import { forwardRef, type InputHTMLAttributes } from 'react';

export type InputProps = {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { variant = 'primary', size = 'md', error = false, className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={clsx(
        'w-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'border border-gray-300 focus:border-amber-500 focus:ring-amber-500':
            variant === 'primary',
          'bg-gray-100 focus:bg-white focus:ring-amber-500':
            variant === 'secondary',
          'border border-gray-300 bg-transparent focus:border-amber-500 focus:ring-amber-500':
            variant === 'outline',
          'px-2 py-1 text-sm rounded': size === 'sm',
          'px-4 py-2 rounded-md': size === 'md',
          'px-6 py-3 text-lg rounded-lg': size === 'lg',
          'border-red-500 focus:ring-red-500': error,
        },
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

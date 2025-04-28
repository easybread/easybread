'use client';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { Icon } from '../Icon/Icon';

export interface SelectOption<T> {
  value: T;
  label: string;
}

export type SelectProps<T> = {
  options: SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  flex?: boolean;
  disabled?: boolean;
  className?: string;
};

export function Select<T>({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  variant = 'primary',
  size = 'md',
  flex = true,
  disabled = false,
  className,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div ref={selectRef} className={clsx('relative', className)}>
      <div
        className={clsx(
          `cursor-pointer font-semibold shadow transition-colors duration-200 focus:ring-2
          focus:ring-offset-2 focus:outline-none`,
          {
            'flex items-center justify-between': flex,
            'bg-amber-200 hover:bg-amber-100 focus:ring-amber-500':
              variant === 'primary',
            'bg-gray-200 hover:bg-amber-100 focus:ring-amber-500':
              variant === 'secondary',
            'border border-gray-300 hover:bg-amber-200 focus:ring-amber-500':
              variant === 'outline',
            'rounded px-2 py-1 text-sm': size === 'sm',
            'rounded-md px-4 py-2': size === 'md',
            'rounded-lg px-6 py-3 text-lg': size === 'lg',
            'cursor-not-allowed opacity-50': disabled,
          },
        )}
        onClick={handleToggle}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>

        <Icon
          iconName={'CHEVRON_DOWN'}
          className={clsx('size-5 stroke-gray-800 transition-transform', {
            'rotate-180': isOpen,
          })}
        />
      </div>
      {isOpen && !disabled && (
        <ul
          className={clsx(
            `absolute z-10 mt-1 w-full overflow-auto border border-gray-300 bg-white
            shadow-lg`,
            {
              rounded: size === 'sm',
              'rounded-md': size === 'md',
              'rounded-lg': size === 'lg',
              'max-h-32': size === 'sm',
              'max-h-48': size === 'md',
              'max-h-60': size === 'lg',
            },
          )}
        >
          {options.map(option => (
            <li
              key={`${option.value}`}
              className={clsx('cursor-pointer px-4 py-2 hover:bg-amber-100', {
                'bg-amber-200': option.value === value,
                'text-sm': size === 'sm',
                'text-base': size === 'md',
                'text-lg': size === 'lg',
              })}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;

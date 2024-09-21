'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
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

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div ref={selectRef} className={clsx('relative', className)}>
      <div
        className={clsx(
          'font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow cursor-pointer',
          {
            'flex items-center justify-between': flex,
            'bg-amber-200 hover:bg-amber-100 focus:ring-amber-500':
              variant === 'primary',
            'bg-gray-200 hover:bg-amber-100 focus:ring-amber-500':
              variant === 'secondary',
            'border-gray-300 border hover:bg-amber-200 focus:ring-amber-500':
              variant === 'outline',
            'px-2 py-1 text-sm rounded': size === 'sm',
            'px-4 py-2 rounded-md': size === 'md',
            'px-6 py-3 text-lg rounded-lg': size === 'lg',
            'opacity-50 cursor-not-allowed': disabled,
          }
        )}
        onClick={handleToggle}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>

        <Icon
          iconName={'CHEVRON_DOWN'}
          className={clsx('w-5 h-5 transition-transform stroke-gray-800', {
            'transform rotate-180': isOpen,
          })}
        />
      </div>
      {isOpen && !disabled && (
        <ul
          className={clsx(
            'absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg overflow-auto',
            {
              rounded: size === 'sm',
              'rounded-md': size === 'md',
              'rounded-lg': size === 'lg',
              'max-h-32': size === 'sm',
              'max-h-48': size === 'md',
              'max-h-60': size === 'lg',
            }
          )}
        >
          {options.map((option) => (
            <li
              key={`${option.value}`}
              className={clsx('px-4 py-2 cursor-pointer hover:bg-amber-100', {
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

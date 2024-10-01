import type { ValueOf } from '@easybread/common';

export const ADAPTER_NAME = {
  GOOGLE_ADMIN_DIRECTORY: 'GOOGLE_ADMIN_DIRECTORY',
  BAMBOO_HR: 'BAMBOO_HR',
} as const;

export const ADAPTER_NAMES = Object.values(ADAPTER_NAME);

export type AdapterName = ValueOf<typeof ADAPTER_NAME>;

export const isAdapterName = (value: unknown): value is AdapterName => {
  return (
    typeof value === 'string' && ADAPTER_NAMES.includes(value as AdapterName)
  );
};

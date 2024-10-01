import type { ValueOf } from '@easybread/common';

export const ICON_NAME = {
  GOOGLE_G_LETTER: 'GOOGLE_G_LETTER',
  CHEVRON_DOWN: 'CHEVRON_DOWN',
  BAMBOO_HR: 'BAMBOO_HR',
} as const;

export type IconName = ValueOf<typeof ICON_NAME>;

export const ICON_NAMES = Object.values(ICON_NAME);

import { isArray } from 'lodash';

export const stringOrArrayToString = (
  value: string | string[] | readonly string[]
): string => (isArray(value) ? value[0] : (value as string));

import { isArray } from 'lodash';

export const stringOrArrayToString = (
  value: string | string[] | readonly string[] | undefined
): string | undefined => {
  return value ? (isArray(value) ? value[0] : (value as string)) : undefined;
};

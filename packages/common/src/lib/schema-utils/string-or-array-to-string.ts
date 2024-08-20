export const stringOrArrayToString = (
  value: string | string[] | readonly string[] | undefined
): string | undefined => {
  return value ? (Array.isArray(value) ? value[0] : (value as string)) : undefined;
};

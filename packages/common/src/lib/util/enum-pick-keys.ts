import type { Simplify } from '../inerfaces';

export type EnumPickKeys<
  E extends Record<string, string>,
  K extends readonly (keyof E)[],
> = { readonly [P in K[number]]: E[P] };

export function enumPickKeys<
  E extends Record<string, string>,
  K extends readonly (keyof E)[],
>(enumObject: E, keys: K): Simplify<EnumPickKeys<E, K>> {
  return keys.reduce(
    (res, k) => {
      return Object.assign(res, { [k]: enumObject[k] });
    },
    {} as Simplify<EnumPickKeys<E, K>>,
  );
}

import type { Simplify } from '../inerfaces';

export type EnumMerge<
  A extends Record<string, string>,
  B extends Record<string, string>,
> = Simplify<A & B>;

export function enumMerge<
  A extends Record<string, string>,
  B extends Record<string, string>,
>(a: A, b: B): EnumMerge<A, B> {
  return Object.assign({}, a, b) as EnumMerge<A, B>;
}

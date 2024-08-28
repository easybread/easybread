/**
 * Checks if a type is a literal type.
 *
 * @template T type to check
 */
export type IsLiteral<T> = [T] extends [
  string | number | bigint | boolean | symbol
]
  ? [string] extends [T]
    ? false
    : [number] extends [T]
    ? false
    : [bigint] extends [T]
    ? false
    : [boolean] extends [T]
    ? false
    : [symbol] extends [T]
    ? false
    : true
  : false;

/**
 * Checks if a type is a literal type.
 *
 * @template T type to check
 */
export type IsLiteral<T> = T extends string | number | boolean
  ? string extends T
    ? false
    : number extends T
    ? false
    : boolean extends T
    ? false
    : bigint extends T
    ? false
    : symbol extends T
    ? false
    : true
  : false;

/**
 * Conditional type.
 * Resolves to `TThen` if `TPredicate` is `true`, otherwise to `TElse`.
 * By default, `TElse` is `never`.
 *
 * @example
 * ```ts
 * type TestA = IfElse<true, string, number>; // string
 * type TestB = IfElse<false, string, number>; // number
 * type TestB = IfElse<false, string>; // never
 * ```
 */
export type IfElse<TPredicate extends boolean, TThen, TElse = never> = [
  TPredicate
] extends [true]
  ? TThen
  : TElse;

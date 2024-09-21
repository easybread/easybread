/**
 * Checks if A includes B.
 * In other words, if B is a subset of A.
 *
 * @example
 * ```ts
 * type EventOne = { foo: number };
 * type EventTwo = { bar: string };
 *
 * type TestA = Includes<EventOne, EventTwo>; // false
 * type TestC = Includes<EventOne | EventTwo, EventTwo> // true;
 * type TestD = Includes<EventTwo, EventOne | EventTwo> // false;
 * ```
 */
export type Includes<A, B> = [B] extends [A] ? true : false;

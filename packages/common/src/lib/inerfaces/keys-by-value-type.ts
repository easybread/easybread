import { IsLiteral } from './is-literal';

/**
 * Extracts a union of keys from an object
 * whose values are of a certain type.
 *
 * @template TObj object to extract keys from
 * @template TValueType value type to extract keys for
 */
export type KeysByValueType<
  TObj extends Record<string | symbol, unknown>,
  TValueType
> = {
  [K in keyof TObj]: TObj[K] extends TValueType
    ? IsLiteral<TObj[K]> extends true
      ? never
      : K
    : never;
}[keyof TObj];

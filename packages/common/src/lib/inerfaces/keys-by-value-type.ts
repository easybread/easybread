/**
 * Extracts a union of keys from an object
 * whose values are of a certain type.
 *
 * @template TObj object to extract keys from
 * @template TValueType value type to extract keys for
 */
export type KeysByValueType<
  TObj extends Record<string, unknown>,
  TValueType
> = {
  [K in keyof TObj]: TObj[K] extends TValueType ? K : never;
}[keyof TObj];

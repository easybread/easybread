/**
 * Converts an interface to a type.
 *
 * @template T interface to convert
 */
export type InterfaceToType<T extends object> = { [K in keyof T]: T[K] };

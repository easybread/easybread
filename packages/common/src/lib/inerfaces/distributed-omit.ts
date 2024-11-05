import type { InterfaceToType } from './interface-to-type';

/**
 * Distributed version of Omit.
 *
 * @example
 * ```ts
 * type Foo = {foo: string}
 * type Bar = {bar: string}
 * type Baz = {baz: string}
 *
 * type A = {
 *   params: Foo|Bar;
 *   name: 'A'
 * }
 *
 * type B = {
 *   params: Bar|Baz;
 *   name: 'B'
 * }
 *
 * type Input = A | B;
 *
 * type SimpleOmitResult = Omit<Input, 'name'>;
 * //   ^?  {params: Foo | Bar | Baz}
 *
 * type Output = DistributedOmit<Input, 'name'>;
 * //   ^?  Omit<A, "bar"> | Omit<B, "bar">
 * //         which is equivalent to
 * //       {params: Foo | Bar} | {params: Bar | Baz}
 * ```
 */
export type DistributedOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

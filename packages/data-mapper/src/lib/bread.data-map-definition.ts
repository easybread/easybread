import { IsLiteral, KeysByValueType } from '@easybread/common';

/**
 * Value factory for producing a value of a certain type
 *
 * @template I input type
 * @template O output type
 */
export type BreadValueFactory<I extends object, O> = (input: I) => O;

/**
 * Value factory for producing a literal value of a certain type
 *
 * @template O output type
 */
export type BreadLiteralFactory<O> = () => O;

/**
 * Constraint for the input and output types of a BreadDataMapper.
 */
export type BreadDataMapIOConstraint = Record<string | symbol, unknown>;

export type BreadDataMapperClass<
  TInput extends BreadDataMapIOConstraint,
  TOutput extends BreadDataMapIOConstraint
> = {
  map(input: TInput): TOutput;
};

/**
 * Resolver for a property of the map definition.
 *
 * @template I input type
 * @template O output type
 */
export type BreadDataMapValueResolverDefinition<
  I extends BreadDataMapIOConstraint,
  O
> =
  | (O extends Array<unknown> ? BreadValueFactory<I, O> : never)
  // if the output[key] is an object, then map recursively.
  | (O extends Record<string | symbol, unknown>
      ? BreadDataMapDefinition<I, O> | BreadDataMapperClass<I, O>
      : never)
  | (IsLiteral<O> extends true
      ? // if the output[key] is a literal type, then a Factory Producing the literal
        BreadLiteralFactory<O>
      : // keys of input whose values have same type as the output[key]
        | KeysByValueType<I, O>
          // a function to create the output value from the input
          | BreadValueFactory<I, O>
          // null is a special case. It means that the property is not mapped.
          | null);
/**
 * Map definition for mapping data from one type to another.
 *
 * @template I input type
 * @template O output type
 */
export type BreadDataMapDefinition<
  I extends BreadDataMapIOConstraint,
  O extends BreadDataMapIOConstraint
> = {
  [K in keyof O]: BreadDataMapValueResolverDefinition<I, O[K]>;
};

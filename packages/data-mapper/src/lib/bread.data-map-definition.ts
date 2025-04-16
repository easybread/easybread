import { IsLiteral, type KeysByValueType } from '@easybread/common';

export const NO_MAP = 'NO_MAP' as const;

export type BreadDataMapNoMapLiteral = typeof NO_MAP;
/**
 * Value factory for producing a value of a certain type.
 *
 * If the value is NO_MAP, the property will not be mapped.
 *
 * @template I input type
 * @template O output type
 */
export type BreadValueFactory<I extends object, O> = (
  input: I,
) => O | BreadDataMapNoMapLiteral;

/**
 * Value factory for producing a literal value of a certain type
 *
 * @template O output type
 */
export type BreadLiteralFactory<I, O> = (input: I) => O;

/**
 * Constraint for the input and output types of a BreadDataMapper.
 */
export type BreadDataMapIOConstraint = Record<string | symbol, unknown>;

export type BreadDataMapperClass<
  TInput extends BreadDataMapIOConstraint,
  TOutput extends BreadDataMapIOConstraint,
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
  O,
> =
  // if the output[key] is an array, then a Factory Producing the array or no map
  | (O extends Array<unknown>
      ? BreadValueFactory<I, O> | BreadDataMapNoMapLiteral
      : never)

  // if the output[key] is an object, then map recursively, or no map
  | (O extends Record<string | symbol, unknown>
      ?
          | BreadDataMapDefinition<I, O> // object to map input to output[key]
          | BreadDataMapperClass<I, O> // class to map input to output[key]
          | BreadDataMapNoMapLiteral // no map
      : never)

  // if the output[key] IS a literal type
  | (IsLiteral<O> extends true
      ?
          | BreadLiteralFactory<I, O> // fn in input -> expected literal
          | BreadDataMapNoMapLiteral // no map
      : never)

  // if the output[key] IS NOT a literal type
  | (IsLiteral<O> extends false
      ?
          | KeysByValueType<I, O> // input keys with values of same type as output[key]
          | BreadValueFactory<I, O> // fn in input -> output[key]
          | BreadDataMapNoMapLiteral // no map
      : never);

/**
 * Map definition for mapping data from one type to another.
 *
 * @template I input type
 * @template O output type
 */
export type BreadDataMapDefinition<
  I extends BreadDataMapIOConstraint,
  O extends BreadDataMapIOConstraint,
> = {
  [K in keyof O]: BreadDataMapValueResolverDefinition<I, O[K]>;
};

export type BreadDataMapDefinitionAny = BreadDataMapDefinition<
  BreadDataMapIOConstraint,
  BreadDataMapIOConstraint
>;

export type inferBreadDataMapDefinitionInput<
  T extends BreadDataMapDefinitionAny,
> =
  T extends BreadDataMapDefinition<infer I, BreadDataMapIOConstraint>
    ? I
    : never;

export type inferBreadDataMapDefinitionOutput<
  T extends BreadDataMapDefinitionAny,
> =
  T extends BreadDataMapDefinition<BreadDataMapIOConstraint, infer O>
    ? O
    : never;

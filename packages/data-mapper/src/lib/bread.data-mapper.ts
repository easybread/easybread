import {
  BreadDataMapDefinition,
  BreadDataMapIOConstraint,
  BreadDataMapperClass,
  BreadDataMapValueResolverDefinition,
  BreadValueFactory,
} from './bread.data-map-definition';

/**
 * Data mapper.
 * Maps data from one type to another.
 *
 * @template TInput input type
 * @template TOutput output type
 */
export class BreadDataMapper<
  TInput extends BreadDataMapIOConstraint,
  TOutput extends BreadDataMapIOConstraint
> implements BreadDataMapperClass<TInput, TOutput>
{
  /**
   * Helper factory method.
   * Creates a new instance of the BreadDataMapper class.
   *
   * @template TInput input type
   * @template TOutput output type
   */
  static create<
    TInput extends BreadDataMapIOConstraint,
    TOutput extends BreadDataMapIOConstraint
  >(mapDefinition: BreadDataMapDefinition<TInput, TOutput>) {
    return new BreadDataMapper<TInput, TOutput>(mapDefinition);
  }

  constructor(private mapDefinition: BreadDataMapDefinition<TInput, TOutput>) {}

  /**
   * Maps the input to the output type.
   */
  map(input: TInput) {
    return this.mapWith<TInput, TOutput>(input, this.mapDefinition);
  }

  /**
   * Maps the input to the output type using the given map definition.
   *
   * @param input
   * @param mapDefinition
   *
   * @template I input type
   * @template O output type
   */
  private mapWith<
    I extends BreadDataMapIOConstraint,
    O extends BreadDataMapIOConstraint
  >(input: I, mapDefinition: BreadDataMapDefinition<I, O>) {
    const output = {} as O;

    for (const key in mapDefinition) {
      if (!Object.hasOwn(mapDefinition, key)) continue;

      const resolver = mapDefinition[key];
      const value = this.resolveValue<
        I,
        BreadDataMapDefinition<I, O>[typeof key],
        O[typeof key]
      >(input, resolver);

      output[key] = value;
    }

    return output;
  }

  /**
   * Resolves the value of the property using the provided resolver definition.
   *
   * @template I input type
   * @template R resolver definition
   * @template O output type
   *
   * @param input
   * @param resolverDef
   *
   * @returns value resolved from the input
   */
  private resolveValue<
    I extends BreadDataMapIOConstraint,
    R extends BreadDataMapValueResolverDefinition<I, O>,
    O
  >(input: I, resolverDef: R): O {
    if (resolverDef === null) return null;

    if (typeof resolverDef === 'string') {
      return input[resolverDef] as Extract<O, string>;
    }

    if (this.isLiteralResolver<O>(resolverDef)) {
      return resolverDef();
    }

    if (this.isFactoryResolver<I, O>(resolverDef)) return resolverDef(input);

    if (
      this.isMapperResolver<I, Extract<O, BreadDataMapIOConstraint>>(
        resolverDef
      )
    ) {
      return resolverDef.map(input);
    }

    if (
      this.isDataMapDefinitionResolver<I, Extract<O, BreadDataMapIOConstraint>>(
        resolverDef
      )
    ) {
      return this.mapWith<I, Extract<O, BreadDataMapIOConstraint>>(
        input,
        resolverDef
      );
    }
  }

  private isDataMapDefinitionResolver<
    I extends BreadDataMapIOConstraint,
    O extends BreadDataMapIOConstraint
  >(value: unknown): value is BreadDataMapDefinition<I, O> {
    return typeof value === 'object';
  }

  private isMapperResolver<
    I extends BreadDataMapIOConstraint,
    O extends BreadDataMapIOConstraint
  >(value: unknown): value is BreadDataMapperClass<I, O> {
    return (
      typeof value === 'object' &&
      'map' in value &&
      typeof value.map === 'function'
    );
  }

  private isLiteralResolver<O>(value: unknown): value is () => O {
    return typeof value === 'function' && value.length === 0;
  }

  private isFactoryResolver<I extends BreadDataMapIOConstraint, O>(
    value: unknown
  ): value is BreadValueFactory<I, O> {
    return typeof value === 'function';
  }
}

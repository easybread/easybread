import { ObjectProperties, ObjectPropertyValueType } from '@easybread/common';
import { isUndefined, reduce } from 'lodash';

import {
  BreadDataMapDefinition,
  DataMapValue,
  OutputPropertyResolver
} from './bread.data-map-definition.interface';

export class BreadPropertiesResolver<
  TInput extends object,
  TOutput extends object
> {
  constructor(
    private readonly mapDefinition: BreadDataMapDefinition<TInput, TOutput>
  ) {}

  resolve(input: TInput): TOutput {
    return reduce(
      this.mapDefinition,
      (
        accumulator,
        mapValue: DataMapValue<TInput, TOutput> | undefined,
        property: string
      ) => {
        accumulator[property] = this.resolveProperty(input, mapValue);
        return accumulator;
      },
      {} as TOutput
    );
  }

  private resolveProperty<TInput extends object, TOutput extends object>(
    input: TInput,
    mapValue: DataMapValue<TInput, TOutput> | undefined
  ): ObjectPropertyValueType<TOutput, ObjectProperties<TOutput>> | undefined {
    if (isUndefined(mapValue)) return undefined;
    if (this.isResolver(mapValue)) return mapValue(input);
    if (this.isProperty(mapValue)) return input[mapValue];
    return undefined;
  }

  private isResolver<
    TInput extends object,
    TOutput extends object,
    TKey extends ObjectProperties<TOutput>
  >(arg: unknown): arg is OutputPropertyResolver<TInput, TOutput, TKey> {
    return typeof arg === 'function';
  }

  private isProperty<TInput extends object>(
    arg: unknown
  ): arg is ObjectProperties<TInput> {
    return typeof arg === 'string';
  }
}

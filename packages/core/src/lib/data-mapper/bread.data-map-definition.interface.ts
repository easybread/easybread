import { ObjectProperties, ObjectPropertyValueType } from '@easybread/common';

export type OutputPropertyResolver<
  TInput extends object,
  TOutput extends object,
  TKey extends ObjectProperties<TOutput>
> = (input: TInput) => ObjectPropertyValueType<TOutput, TKey>;

export type DataMapKey<TOutput extends object> = ObjectProperties<TOutput>;

export type DataMapValue<TInput extends object, TOutput extends object> =
  | ObjectProperties<TInput>
  | OutputPropertyResolver<TInput, TOutput, ObjectProperties<TOutput>>;
// | ObjectPropertyValueType<TOutput, ObjectProperties<TOutput>>

type BreadDataMapDefinitionBase<
  TInput extends object,
  TOutput extends object
> = Record<DataMapKey<TOutput>, DataMapValue<TInput, TOutput>>;

export type BreadDataMapDefinition<
  TInput extends object,
  TOutput extends object
> = Partial<BreadDataMapDefinitionBase<TInput, TOutput>>;

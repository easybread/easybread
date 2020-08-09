import { ObjectProperties } from './object-properties.interface';

export type ObjectPropertyValueType<
  T extends object,
  TKey extends ObjectProperties<T>
> = T[TKey];

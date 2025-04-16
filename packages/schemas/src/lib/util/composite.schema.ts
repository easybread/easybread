import type { _AnySchema } from '../any.schema';

export type CompositeSchema<T extends _AnySchema[]> = {
  '@type': 'Composite';
} & Partial<{
  [K in T[number]['@type']]: Extract<T[number], { '@type': K }>;
}>;

import type { AnySchema } from '../any.schema';

export type SchemaPick<
  S extends AnySchema,
  K extends Exclude<keyof S, '@type'>,
> = Pick<S, K | '@type'>;

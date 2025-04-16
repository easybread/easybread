export type SchemaPick<
  S extends { '@type': string },
  K extends Exclude<keyof S, '@type'>,
> = Pick<S, K | '@type'>;

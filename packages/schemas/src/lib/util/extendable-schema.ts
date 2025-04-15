export type ExtendableSchema<T extends { '@type': string }> = Omit<T, '@type'>;

/**
 * Generic schema fetcher interface
 * TSchema is the native format that this fetcher produces
 */
export interface SchemaFetcher<TSchema> {
  fetchSchema(): Promise<TSchema>;
}

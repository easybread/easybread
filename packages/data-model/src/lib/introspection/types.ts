import type { DataModelDef } from '../data-model.js';

// ========================================
// GENERIC INTROSPECTION INTERFACES
// ========================================

/**
 * Generic schema fetcher interface
 * TSchema is the native format that this fetcher produces
 */
export interface SchemaFetcher<TSchema> {
  fetchSchema(): Promise<TSchema>;
}

/**
 * Generic schema transformer interface
 * TInput is the schema format it expects
 * TOutput is what it produces (usually DataModelDef)
 */
export interface SchemaTransformer<TInput, TOutput = DataModelDef> {
  transform(schema: TInput, modelName: string): TOutput;
}

/**
 * Generic introspection strategy interface
 * TSchema ensures fetcher and transformer work with the same format
 */
export interface IntrospectionStrategy<TSchema = unknown> {
  introspect(): Promise<DataModelDef>;
}

// ========================================
// ERROR HIERARCHY
// ========================================

export abstract class IntrospectionError extends Error {
  constructor(
    message: string,
    public readonly options?: { cause?: unknown },
  ) {
    super(message);
    this.name = this.constructor.name;
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export class InvalidConfigError extends IntrospectionError {}
export class SchemaFetchError extends IntrospectionError {}
export class TransformationError extends IntrospectionError {}
export class ConnectionError extends IntrospectionError {}

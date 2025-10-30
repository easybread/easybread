import type { DataModelDef } from '../DataModel';

import { IntrospectionError, UnknownError } from './IntrospectionError';
import { type SchemaFetcher } from './SchemaFetcher';
import { type SchemaTransformer } from './SchemaTransformer';

/**
 * Generic introspection strategy that ensures fetcher/transformer compatibility
 * The type parameter TSchema enforces that both components work with the same schema format
 */
export class IntrospectionStrategy<TSchema> {
  constructor(
    private readonly fetcher: SchemaFetcher<TSchema>,
    private readonly transformer: SchemaTransformer<TSchema>,
    private readonly modelName: string,
  ) {
    this.validateInputs();
  }

  async introspect(): Promise<DataModelDef> {
    try {
      const schema = await this.fetcher.fetchSchema();
      return this.transformer.transform(schema, this.modelName);
    } catch (error) {
      // Re-throw our custom errors as-is to preserve error context
      if (error instanceof IntrospectionError) throw error;

      // Wrap unknown errors in a generic introspection error
      throw new UnknownError('Failed to introspect schema', {
        cause: error,
      });
    }
  }

  private validateInputs(): void {
    if (!this.fetcher) {
      throw new Error('Schema fetcher is required');
    }

    if (!this.transformer) {
      throw new Error('Schema transformer is required');
    }

    if (!this.modelName || typeof this.modelName !== 'string') {
      throw new Error('Model name must be a non-empty string');
    }

    if (this.modelName.trim().length === 0) {
      throw new Error('Model name cannot be empty or whitespace only');
    }
  }
}

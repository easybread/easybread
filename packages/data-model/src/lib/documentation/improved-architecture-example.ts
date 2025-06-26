import type { DataModelDef } from '../data-model';

import type { DbmlSchema } from './types';

// ========================================
// 1. SEPARATE DATA FETCHING FROM TRANSFORMATION
// ========================================

/**
 * Responsible only for fetching schema data
 */
export interface SchemaFetcher {
  fetchSchema(): Promise<DbmlSchema>;
}

/**
 * Responsible only for transforming schema to data model
 */
export interface SchemaTransformer<TInput, TOutput = DataModelDef> {
  transform(schema: TInput, modelName: string): TOutput;
}

/**
 * Orchestrates fetching and transformation
 */
export interface IntrospectionStrategy {
  introspect(): Promise<DataModelDef>;
}

// ========================================
// 2. CONCRETE IMPLEMENTATIONS
// ========================================

export interface PostgresSchemaFetcherConfig {
  connectionString: string;
  timeout?: number;
  retries?: number;
}

export class PostgresSchemaFetcher implements SchemaFetcher {
  constructor(private readonly config: PostgresSchemaFetcherConfig) {
    this.validateConfig();
  }

  async fetchSchema(): Promise<DbmlSchema> {
    // Implementation with proper error handling, retries, etc.
    throw new Error('Implementation needed');
  }

  private validateConfig(): void {
    if (!this.config.connectionString) {
      throw new InvalidConfigError('Connection string is required');
    }

    try {
      new URL(this.config.connectionString);
    } catch {
      throw new InvalidConfigError('Invalid connection string format');
    }
  }
}

export class DbmlToDataModelTransformer
  implements SchemaTransformer<DbmlSchema> {
  // Current implementation stays the same but becomes injectable
}

/**
 * Clean strategy that orchestrates components
 */
export class PostgresIntrospectionStrategy implements IntrospectionStrategy {
  constructor(
    private readonly fetcher: SchemaFetcher,
    private readonly transformer: SchemaTransformer<DbmlSchema>,
    private readonly modelName: string,
  ) {}

  async introspect(): Promise<DataModelDef> {
    try {
      const schema = await this.fetcher.fetchSchema();
      return this.transformer.transform(schema, this.modelName);
    } catch (error) {
      if (error instanceof IntrospectionError) {
        throw error; // Re-throw our custom errors
      }
      throw new IntrospectionError('Failed to introspect database', {
        cause: error,
      });
    }
  }
}

// ========================================
// 3. ERROR HIERARCHY
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
export class ConnectionError extends IntrospectionError {}
export class SchemaFetchError extends IntrospectionError {}
export class TransformationError extends IntrospectionError {}

// ========================================
// 4. FACTORY FOR EASY USAGE
// ========================================

export interface PostgresIntrospectionFactoryConfig {
  connectionString: string;
  databaseName?: string;
  timeout?: number;
  retries?: number;
}

export class PostgresIntrospectionFactory {
  static create(
    config: PostgresIntrospectionFactoryConfig,
  ): IntrospectionStrategy {
    const fetcher = new PostgresSchemaFetcher({
      connectionString: config.connectionString,
      timeout: config.timeout,
      retries: config.retries,
    });

    const transformer = new DbmlToDataModelTransformer();

    const modelName =
      config.databaseName || this.extractDatabaseName(config.connectionString);

    return new PostgresIntrospectionStrategy(fetcher, transformer, modelName);
  }

  private static extractDatabaseName(connectionString: string): string {
    try {
      const url = new URL(connectionString);
      return url.pathname.slice(1) || 'unknown_database';
    } catch {
      return 'unknown_database';
    }
  }
}

// ========================================
// 5. USAGE EXAMPLES
// ========================================

// Simple usage (same as before)
const strategy = PostgresIntrospectionFactory.create({
  connectionString: process.env.DATABASE_URL!,
  databaseName: 'my_app',
});

// Advanced usage with dependency injection (great for testing)
const customFetcher = new PostgresSchemaFetcher({
  /* config */
});
const customTransformer = new DbmlToDataModelTransformer();
const customStrategy = new PostgresIntrospectionStrategy(
  customFetcher,
  customTransformer,
  'test_model',
);

// Easy mocking for tests
const mockFetcher: SchemaFetcher = {
  fetchSchema: async () => mockDbmlSchema,
};
const testStrategy = new PostgresIntrospectionStrategy(
  mockFetcher,
  transformer,
  'test',
);

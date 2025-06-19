import type { DataModelDef } from '../data-model.js';

import type { DbmlSchema } from './types.js';

// ========================================
// 1. PROPERLY ABSTRACTED GENERIC INTERFACES
// ========================================

/**
 * Generic schema fetcher - doesn't expose implementation details
 * TSchema is the native format that this fetcher produces
 */
export interface SchemaFetcher<TSchema> {
  fetchSchema(): Promise<TSchema>;
}

/**
 * Generic schema transformer - works with specific input types
 * TInput is the schema format it expects
 * TOutput is what it produces (usually DataModelDef)
 */
export interface SchemaTransformer<TInput, TOutput = DataModelDef> {
  transform(schema: TInput, modelName: string): TOutput;
}

/**
 * Generic introspection strategy that enforces compatibility
 * TSchema ensures fetcher and transformer work with the same format
 */
export interface IntrospectionStrategy<TSchema = unknown> {
  introspect(): Promise<DataModelDef>;
}

// ========================================
// 2. GENERIC STRATEGY IMPLEMENTATION
// ========================================

/**
 * Generic strategy that ensures fetcher/transformer compatibility
 * The type parameter TSchema enforces that both components work with the same schema format
 */
export class GenericIntrospectionStrategy<TSchema>
  implements IntrospectionStrategy<TSchema>
{
  constructor(
    private readonly fetcher: SchemaFetcher<TSchema>,
    private readonly transformer: SchemaTransformer<TSchema>,
    private readonly modelName: string,
  ) {}

  async introspect(): Promise<DataModelDef> {
    try {
      const schema = await this.fetcher.fetchSchema();
      return this.transformer.transform(schema, this.modelName);
    } catch (error) {
      if (error instanceof IntrospectionError) {
        throw error;
      }
      throw new IntrospectionError('Failed to introspect schema', {
        cause: error,
      });
    }
  }
}

// ========================================
// 3. POSTGRESQL-SPECIFIC IMPLEMENTATIONS
// ========================================

export interface PostgresSchemaFetcherConfig {
  connectionString: string;
  timeout?: number;
  retries?: number;
  schemaFilter?: string[];
}

/**
 * PostgreSQL fetcher - returns DbmlSchema (implementation detail hidden behind interface)
 */
export class PostgresSchemaFetcher implements SchemaFetcher<DbmlSchema> {
  constructor(private readonly config: PostgresSchemaFetcherConfig) {
    this.validateConfig();
  }

  async fetchSchema(): Promise<DbmlSchema> {
    // Implementation details - consumers don't need to know about @dbml/connector
    const { connector } = await import('@dbml/connector');

    try {
      const dbmlSchema = await connector.fetchSchemaJson(
        this.config.connectionString,
        'postgres',
      );

      return this.validateAndCastSchema(dbmlSchema);
    } catch (error) {
      throw new SchemaFetchError('Failed to fetch PostgreSQL schema', {
        cause: error,
      });
    }
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

  private validateAndCastSchema(rawSchema: unknown): DbmlSchema {
    // Runtime validation of the schema structure
    if (!rawSchema || typeof rawSchema !== 'object') {
      throw new SchemaFetchError('Invalid schema format received');
    }

    // Add more validation as needed
    return rawSchema as DbmlSchema;
  }
}

/**
 * DBML to DataModel transformer - works specifically with DbmlSchema
 */
export class DbmlToDataModelTransformer
  implements SchemaTransformer<DbmlSchema>
{
  // Current implementation stays the same - it's now properly injectable
  transform(schema: DbmlSchema, modelName: string): DataModelDef {
    // Implementation details hidden from strategy consumers
    throw new Error('Implementation moved from existing transformer');
  }
}

// ========================================
// 4. FACTORY PATTERN FOR CONVENIENCE
// ========================================

export interface PostgresIntrospectionFactoryConfig {
  connectionString: string;
  databaseName?: string;
  timeout?: number;
  retries?: number;
  schemaFilter?: string[];
}

export class PostgresIntrospectionFactory {
  static create(
    config: PostgresIntrospectionFactoryConfig,
  ): IntrospectionStrategy<DbmlSchema> {
    const fetcher = new PostgresSchemaFetcher({
      connectionString: config.connectionString,
      timeout: config.timeout,
      retries: config.retries,
      schemaFilter: config.schemaFilter,
    });

    const transformer = new DbmlToDataModelTransformer();

    const modelName =
      config.databaseName || this.extractDatabaseName(config.connectionString);

    return new GenericIntrospectionStrategy(fetcher, transformer, modelName);
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
// 5. EXAMPLE: API-BASED STRATEGY (FUTURE)
// ========================================

/**
 * Example showing how other data sources would work
 * Notice: completely different schema format, but same pattern
 */
export interface ApiSchema {
  tables: Array<{
    name: string;
    columns: Array<{
      name: string;
      type: string;
      nullable: boolean;
    }>;
  }>;
  relationships: Array<{
    from: string;
    to: string;
    type: 'one-to-many' | 'many-to-many';
  }>;
}

export interface ApiSchemaFetcherConfig {
  endpoint: string;
  apiKey: string;
  timeout?: number;
}

export class ApiSchemaFetcher implements SchemaFetcher<ApiSchema> {
  constructor(private readonly config: ApiSchemaFetcherConfig) {}

  async fetchSchema(): Promise<ApiSchema> {
    // Fetch from API and return ApiSchema format
    // Implementation details completely different from PostgreSQL
    throw new Error('API implementation');
  }
}

export class ApiToDataModelTransformer implements SchemaTransformer<ApiSchema> {
  transform(schema: ApiSchema, modelName: string): DataModelDef {
    // Transform ApiSchema to DataModelDef
    // Completely different logic from DBML transformation
    throw new Error('API transformer implementation');
  }
}

// Usage: API strategy (same pattern, different types)
export class ApiIntrospectionFactory {
  static create(
    config: ApiSchemaFetcherConfig & { modelName: string },
  ): IntrospectionStrategy<ApiSchema> {
    const fetcher = new ApiSchemaFetcher(config);
    const transformer = new ApiToDataModelTransformer();

    return new GenericIntrospectionStrategy(
      fetcher,
      transformer,
      config.modelName,
    );
  }
}

// ========================================
// 6. ERROR HIERARCHY (UNCHANGED)
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

// ========================================
// 7. USAGE EXAMPLES
// ========================================

// Simple PostgreSQL usage (implementation details hidden)
const postgresStrategy = PostgresIntrospectionFactory.create({
  connectionString: process.env.DATABASE_URL!,
  databaseName: 'my_app',
});

// Advanced PostgreSQL usage (full control, great for testing)
const customFetcher = new PostgresSchemaFetcher({
  connectionString: process.env.DATABASE_URL!,
  timeout: 30000,
});
const customTransformer = new DbmlToDataModelTransformer();
const advancedStrategy = new GenericIntrospectionStrategy(
  customFetcher,
  customTransformer,
  'custom_model',
);

// API usage (completely different implementation, same interface)
const apiStrategy = ApiIntrospectionFactory.create({
  endpoint: 'https://api.example.com/schema',
  apiKey: process.env.API_KEY!,
  modelName: 'api_model',
});

// All strategies have the same interface - true polymorphism!
const strategies: IntrospectionStrategy[] = [
  postgresStrategy,
  advancedStrategy,
  apiStrategy,
];

for (const strategy of strategies) {
  const model = await strategy.introspect(); // Same interface, different implementations
  console.log(model.name);
}

// ========================================
// 8. TESTING EXAMPLES
// ========================================

// Easy mocking - no DbmlSchema leaked to test code
const mockFetcher: SchemaFetcher<DbmlSchema> = {
  fetchSchema: async () => mockDbmlSchemaFixture,
};

const mockTransformer: SchemaTransformer<DbmlSchema> = {
  transform: (schema, name) => mockDataModelFixture,
};

const testStrategy = new GenericIntrospectionStrategy(
  mockFetcher,
  mockTransformer,
  'test',
);

// Test can focus on strategy logic without knowing about DbmlSchema
const result = await testStrategy.introspect();
expect(result.name).toBe('test');

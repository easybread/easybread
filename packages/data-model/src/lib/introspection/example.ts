import type { DbmlSchema } from './dbml-types.js';
import {
  GenericIntrospectionStrategy,
  PostgresIntrospectionFactory,
  type PostgresIntrospectionFactoryConfig,
  PostgresSchemaFetcher,
  type PostgresSchemaFetcherConfig,
  introspectPostgres,
} from './index.js';
import { DbmlToDataModelTransformer } from './transformer.js';

/**
 * Simple usage with the new factory (recommended approach)
 */
export async function simpleIntrospection() {
  // Using the factory - hides implementation details
  const strategy = PostgresIntrospectionFactory.create({
    connectionString: process.env.POSTGRES_FOO_CONN_URL!,
    databaseName: 'my_database', // Optional
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000, // 1 second between retries
  });

  try {
    const dataModel = await strategy.introspect();
    console.log('Introspected data model:', JSON.stringify(dataModel, null, 2));
    return dataModel;
  } catch (error) {
    console.error('Introspection failed:', error);
    throw error;
  }
}

/**
 * Even simpler with the convenience function
 */
export async function convenientIntrospection() {
  const config: PostgresIntrospectionFactoryConfig = {
    connectionString: process.env.POSTGRES_FOO_CONN_URL!,
    databaseName: 'my_app',
    timeout: 60000, // 1 minute for large schemas
    retries: 2,
  };

  // One-liner introspection
  const dataModel = await introspectPostgres(config);
  return dataModel;
}

/**
 * Advanced usage with dependency injection (great for testing and customization)
 */
export async function advancedIntrospection() {
  // Create individual components
  const fetcherConfig: PostgresSchemaFetcherConfig = {
    connectionString: process.env.POSTGRES_FOO_CONN_URL!,
    timeout: 45000,
    retries: 3,
    retryDelay: 2000,
    schemaFilter: ['public', 'app'], // Only introspect specific schemas
  };

  const fetcher = new PostgresSchemaFetcher(fetcherConfig);
  const transformer = new DbmlToDataModelTransformer();

  // Create strategy with full control
  const strategy = new GenericIntrospectionStrategy(
    fetcher,
    transformer,
    'custom_model_name',
  );

  return strategy.introspect();
}

/**
 * Example showing error handling with specific error types
 */
export async function introspectionWithErrorHandling() {
  try {
    const strategy = PostgresIntrospectionFactory.create({
      connectionString: process.env.DATABASE_URL!,
      timeout: 10000,
      retries: 2,
    });

    return await strategy.introspect();
  } catch (error) {
    // Import error types to handle specific cases
    const {
      ConnectionError,
      SchemaFetchError,
      TransformationError,
      InvalidConfigError,
    } = await import('./types.js');

    if (error instanceof ConnectionError) {
      console.error('Failed to connect to database:', error.message);
      // Maybe retry with different connection params
    } else if (error instanceof SchemaFetchError) {
      console.error('Failed to fetch schema:', error.message);
      // Maybe the database is temporarily unavailable
    } else if (error instanceof TransformationError) {
      console.error('Failed to transform schema:', error.message);
      // Maybe the schema has unexpected structure
    } else if (error instanceof InvalidConfigError) {
      console.error('Invalid configuration:', error.message);
      // Fix configuration and retry
    } else {
      console.error('Unexpected error:', error);
    }

    throw error;
  }
}

/**
 * Example with environmental configuration
 */
export async function environmentBasedIntrospection() {
  const connectionString =
    process.env.DATABASE_URL || process.env.POSTGRES_FOO_CONN_URL;

  if (!connectionString) {
    throw new Error(
      'No database connection string found in environment variables',
    );
  }

  const config: PostgresIntrospectionFactoryConfig = {
    connectionString,
    databaseName: process.env.DATABASE_NAME,
    timeout: parseInt(process.env.DB_TIMEOUT || '30000'),
    retries: parseInt(process.env.DB_RETRIES || '3'),
    retryDelay: parseInt(process.env.DB_RETRY_DELAY || '1000'),
  };

  return introspectPostgres(config);
}

/**
 * Example for testing with mocks (demonstrates the improved testability)
 */
export async function testableIntrospection() {
  // This would be in your test file
  const mockDbmlSchema: DbmlSchema = {
    tables: [
      {
        name: 'users',
        schemaName: 'public',
        note: { value: '' },
      },
    ],
    fields: {
      'public.users': [
        {
          name: 'id',
          type: { type_name: 'uuid', schemaName: null },
          dbdefault: null,
          not_null: true,
          increment: false,
          note: { value: '' },
        },
      ],
    },
    refs: [],
    enums: [],
    indexes: {},
    tableConstraints: {
      'public.users': {
        id: { pk: true }, // This matches the DbmlConstraint type
      },
    },
  };

  // Easy mocking without implementation details leaking
  const mockFetcher = {
    fetchSchema: async () => mockDbmlSchema,
  };

  const transformer = new DbmlToDataModelTransformer();

  const strategy = new GenericIntrospectionStrategy(
    mockFetcher,
    transformer,
    'test_model',
  );

  const result = await strategy.introspect();
  console.log('Test result:', result.name); // 'test_model'

  return result;
}

/**
 * Backward compatibility example (for existing code)
 */
export async function backwardCompatibleIntrospection() {
  // This still works but is deprecated
  const { PostgresIntrospectionStrategy } = await import(
    './postgres-strategy.js'
  );

  const strategy = new PostgresIntrospectionStrategy({
    connectionString: process.env.POSTGRES_FOO_CONN_URL!,
    databaseName: 'legacy_app',
  });

  return strategy.introspect();
}

/**
 * Example showing multiple strategies (different data sources)
 */
export async function multiSourceIntrospection() {
  // PostgreSQL strategy
  const postgresStrategy = PostgresIntrospectionFactory.create({
    connectionString: process.env.POSTGRES_URL!,
    databaseName: 'postgres_db',
  });

  // In the future, you could have other strategies:
  // const apiStrategy = ApiIntrospectionFactory.create({
  //   endpoint: 'https://api.example.com/schema',
  //   apiKey: process.env.API_KEY!,
  //   modelName: 'api_model',
  // });

  // const fileStrategy = FileIntrospectionFactory.create({
  //   filePath: './schema.json',
  //   format: 'json',
  //   modelName: 'file_model',
  // });

  // All strategies implement the same interface
  const strategies = [
    postgresStrategy,
    // apiStrategy,
    // fileStrategy,
  ];

  const results = await Promise.all(
    strategies.map(strategy => strategy.introspect()),
  );

  console.log(`Introspected ${results.length} data sources`);
  return results;
}

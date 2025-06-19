# Database Introspection Module

A flexible, type-safe, and extensible module for introspecting databases and transforming their schemas into `@data-model.ts` format. Built with a clean architecture that supports multiple data sources and provides excellent testability.

## Features

- **🔧 Strategy Pattern**: Easily extensible to support different data sources
- **🛡️ Type Safety**: Full TypeScript support with generic interfaces
- **🧪 Testable**: Dependency injection for easy mocking and testing
- **⚡ Performance**: Optimized with resource management and error handling
- **🔄 Retries**: Built-in retry logic with configurable timeouts
- **📋 Validation**: Comprehensive input validation and error hierarchy

## Quick Start

### Simple Usage (Recommended)

```typescript
import { introspectPostgres } from '@data-model/introspection';

// One-liner introspection
const dataModel = await introspectPostgres({
  connectionString: process.env.DATABASE_URL!,
  databaseName: 'my_app',
  timeout: 30000,
  retries: 3,
});

console.log('Data model:', dataModel.name);
```

### Factory Pattern

```typescript
import { PostgresIntrospectionFactory } from '@data-model/introspection';

const strategy = PostgresIntrospectionFactory.create({
  connectionString: process.env.DATABASE_URL!,
  databaseName: 'my_database',
  timeout: 60000, // 1 minute for large schemas
  retries: 2,
  retryDelay: 1000, // 1 second between retries
});

const dataModel = await strategy.introspect();
```

## Architecture

The module uses a clean, generic architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  SchemaFetcher  │    │ SchemaTransformer│    │ IntrospectionStrat.
│<TSchema>        │    │<TIn, TOut>      │    │<TSchema>        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │GenericIntro...  │
                    │Strategy<TSchema>│
                    └─────────────────┘
```

### Core Components

- **SchemaFetcher<TSchema>**: Fetches raw schema from data source
- **SchemaTransformer<TIn, TOut>**: Transforms schema to target format
- **IntrospectionStrategy<TSchema>**: Orchestrates the process
- **GenericIntrospectionStrategy**: Type-safe implementation ensuring fetcher/transformer compatibility

## Advanced Usage

### Dependency Injection (Testing & Customization)

```typescript
import {
  GenericIntrospectionStrategy,
  PostgresSchemaFetcher,
  DbmlToDataModelTransformer,
} from '@data-model/introspection';

// Create individual components
const fetcher = new PostgresSchemaFetcher({
  connectionString: process.env.DATABASE_URL!,
  timeout: 45000,
  retries: 3,
  schemaFilter: ['public', 'app'], // Only specific schemas
});

const transformer = new DbmlToDataModelTransformer();

// Full control over strategy
const strategy = new GenericIntrospectionStrategy(
  fetcher,
  transformer,
  'custom_model_name',
);

const result = await strategy.introspect();
```

### Error Handling

```typescript
import {
  introspectPostgres,
  ConnectionError,
  SchemaFetchError,
  TransformationError,
  InvalidConfigError,
} from '@data-model/introspection';

try {
  const dataModel = await introspectPostgres({
    connectionString: process.env.DATABASE_URL!,
    timeout: 10000,
  });
} catch (error) {
  if (error instanceof ConnectionError) {
    console.error('Database connection failed:', error.message);
  } else if (error instanceof SchemaFetchError) {
    console.error('Schema fetch failed:', error.message);
  } else if (error instanceof TransformationError) {
    console.error('Schema transformation failed:', error.message);
  } else if (error instanceof InvalidConfigError) {
    console.error('Invalid configuration:', error.message);
  }
  
  // All errors include cause chain for debugging
  console.error('Root cause:', error.cause);
}
```

### Testing with Mocks

```typescript
import {
  GenericIntrospectionStrategy,
  DbmlToDataModelTransformer,
  type DbmlSchema,
} from '@data-model/introspection';

// Easy mocking - no implementation details leak
const mockFetcher = {
  fetchSchema: async (): Promise<DbmlSchema> => ({
    tables: [{ name: 'users', schemaName: 'public', note: { value: '' } }],
    fields: {
      'public.users': [{
        name: 'id',
        type: { type_name: 'uuid', schemaName: null },
        dbdefault: null,
        not_null: true,
        increment: false,
        note: { value: '' },
      }],
    },
    refs: [],
    enums: [],
    indexes: {},
    tableConstraints: { 'public.users': { id: { pk: true } } },
  }),
};

const strategy = new GenericIntrospectionStrategy(
  mockFetcher,
  new DbmlToDataModelTransformer(),
  'test_model',
);

const result = await strategy.introspect();
expect(result.name).toBe('test_model');
```

## Configuration Options

### PostgresIntrospectionFactoryConfig

```typescript
interface PostgresIntrospectionFactoryConfig {
  connectionString: string;     // Required: PostgreSQL connection URL
  databaseName?: string;        // Optional: Override database name
  timeout?: number;             // Optional: Query timeout in ms (default: 30000)
  retries?: number;             // Optional: Retry attempts (default: 1)
  retryDelay?: number;          // Optional: Delay between retries in ms
  schemaFilter?: string[];      // Optional: Only introspect specific schemas
}
```

### PostgresSchemaFetcherConfig

```typescript
interface PostgresSchemaFetcherConfig {
  connectionString: string;     // Required: PostgreSQL connection URL
  timeout?: number;             // Optional: Query timeout in ms
  retries?: number;             // Optional: Number of retry attempts
  retryDelay?: number;          // Optional: Delay between retries in ms
  schemaFilter?: string[];      // Optional: Schema name filter
}
```

## Migration Guide

### From v1 to v2

**Old Code (Deprecated but still works):**
```typescript
import { PostgresIntrospectionStrategy } from '@data-model/introspection';

const strategy = new PostgresIntrospectionStrategy({
  connectionString: process.env.DATABASE_URL!,
  databaseName: 'my_db',
});

const result = await strategy.introspect();
```

**New Code (Recommended):**
```typescript
import { PostgresIntrospectionFactory } from '@data-model/introspection';

const strategy = PostgresIntrospectionFactory.create({
  connectionString: process.env.DATABASE_URL!,
  databaseName: 'my_db',
  timeout: 30000, // New: configurable timeout
  retries: 3,     // New: retry logic
});

const result = await strategy.introspect();
```

**Or even simpler:**
```typescript
import { introspectPostgres } from '@data-model/introspection';

const result = await introspectPostgres({
  connectionString: process.env.DATABASE_URL!,
  databaseName: 'my_db',
});
```

## Error Hierarchy

```
IntrospectionError (base)
├── InvalidConfigError      - Configuration validation errors
├── ConnectionError         - Database connection issues
├── SchemaFetchError       - Schema retrieval problems
└── TransformationError    - Schema transformation failures
```

All errors include:
- Descriptive error messages
- Cause chain for debugging
- Proper error inheritance

## Extension Points

### Adding New Data Sources

```typescript
// 1. Define your schema type
interface ApiSchema {
  endpoints: Array<{ path: string; method: string }>;
  models: Array<{ name: string; fields: any[] }>;
}

// 2. Implement SchemaFetcher
class ApiSchemaFetcher implements SchemaFetcher<ApiSchema> {
  constructor(private config: { apiKey: string; endpoint: string }) {}
  
  async fetchSchema(): Promise<ApiSchema> {
    // Fetch from API
  }
}

// 3. Implement SchemaTransformer
class ApiToDataModelTransformer implements SchemaTransformer<ApiSchema> {
  transform(schema: ApiSchema, modelName: string): DataModelDef {
    // Transform API schema to DataModelDef
  }
}

// 4. Use with GenericIntrospectionStrategy
const strategy = new GenericIntrospectionStrategy(
  new ApiSchemaFetcher({ apiKey: 'key', endpoint: 'url' }),
  new ApiToDataModelTransformer(),
  'api_model',
);
```

### Creating Factories for New Sources

```typescript
export class ApiIntrospectionFactory {
  static create(config: ApiConfig): IntrospectionStrategy<ApiSchema> {
    return new GenericIntrospectionStrategy(
      new ApiSchemaFetcher(config),
      new ApiToDataModelTransformer(),
      config.modelName,
    );
  }
}
```

## Best Practices

1. **Use the Factory Pattern** for simple cases
2. **Use Dependency Injection** for testing and customization
3. **Handle Errors Specifically** using the error hierarchy
4. **Configure Timeouts** appropriate for your database size
5. **Use Schema Filters** to improve performance on large databases
6. **Mock Carefully** in tests to avoid implementation details leaking

## Performance Considerations

- **Timeouts**: Configure appropriate timeouts for large schemas
- **Retries**: Use retries for network reliability
- **Schema Filtering**: Only introspect needed schemas
- **Resource Management**: Automatic cleanup and connection management
- **Caching**: Transformer instances can be reused safely

## Dependencies

- `@dbml/connector`: For PostgreSQL schema introspection
- Native `URL` API: For connection string validation

The module uses dynamic imports to avoid loading `@dbml/connector` unless actually needed, reducing bundle size for applications that don't use PostgreSQL introspection. 
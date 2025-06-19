// New generic architecture (recommended)
export { GenericIntrospectionStrategy } from './generic-strategy.js';
export {
  PostgresIntrospectionFactory,
  introspectPostgres,
  type PostgresIntrospectionFactoryConfig,
} from './postgres-factory.js';
export {
  PostgresSchemaFetcher,
  type PostgresSchemaFetcherConfig,
} from './postgres-fetcher.js';

// Backward compatibility (deprecated)
export {
  PostgresIntrospectionStrategy,
  type PostgresIntrospectionConfig,
} from './postgres-strategy.js';

// Core components
export { DbmlToDataModelTransformer } from './transformer.js';

// Generic interfaces and error types
export type {
  IntrospectionStrategy,
  SchemaFetcher,
  SchemaTransformer,
} from './types.js';
export {
  IntrospectionError,
  InvalidConfigError,
  SchemaFetchError,
  TransformationError,
  ConnectionError,
} from './types.js';

// DBML-specific types (for PostgreSQL implementation)
export type {
  DbmlConstraint,
  DbmlEnum,
  DbmlField,
  DbmlIndex,
  DbmlRef,
  DbmlRefEndpoint,
  DbmlSchema,
  DbmlTable,
} from './dbml-types.js';

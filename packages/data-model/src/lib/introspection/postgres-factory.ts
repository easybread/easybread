import type { DataModelDef } from '../data-model.js';

import type { DbmlSchema } from './dbml-types.js';
import { GenericIntrospectionStrategy } from './generic-strategy.js';
import {
  PostgresSchemaFetcher,
  type PostgresSchemaFetcherConfig,
} from './postgres-fetcher.js';
import { DbmlToDataModelTransformer } from './transformer.js';
import type { IntrospectionStrategy } from './types.js';

export interface PostgresIntrospectionFactoryConfig {
  connectionString: string;
  databaseName?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  schemaFilter?: string[];
}

export class PostgresIntrospectionFactory {
  private static sharedTransformer = new DbmlToDataModelTransformer();

  static create(
    config: PostgresIntrospectionFactoryConfig,
  ): IntrospectionStrategy<DbmlSchema> {
    const fetcherConfig: PostgresSchemaFetcherConfig = {
      connectionString: config.connectionString,
      timeout: config.timeout,
      retries: config.retries,
      retryDelay: config.retryDelay,
      schemaFilter: config.schemaFilter,
    };

    const fetcher = new PostgresSchemaFetcher(fetcherConfig);
    const transformer = this.sharedTransformer; // Reuse for better performance

    const modelName =
      config.databaseName ?? this.extractDatabaseName(config.connectionString);

    return new GenericIntrospectionStrategy(fetcher, transformer, modelName);
  }

  /**
   * Create with individual components for advanced usage (testing, customization)
   */
  static createAdvanced(
    fetcher: PostgresSchemaFetcher,
    transformer: DbmlToDataModelTransformer,
    modelName: string,
  ): IntrospectionStrategy<DbmlSchema> {
    return new GenericIntrospectionStrategy(fetcher, transformer, modelName);
  }

  /**
   * Create a new transformer instance (if sharing is not desired)
   */
  static createTransformer(): DbmlToDataModelTransformer {
    return new DbmlToDataModelTransformer();
  }

  private static extractDatabaseName(connectionString: string): string {
    try {
      const url = new URL(connectionString);
      const pathname = url.pathname;
      // Remove leading slash and return database name, or fallback
      return pathname.slice(1) || 'unknown_database';
    } catch {
      return 'unknown_database';
    }
  }
}

// Convenience function for simple usage
export async function introspectPostgres(
  config: PostgresIntrospectionFactoryConfig,
): Promise<DataModelDef> {
  const strategy = PostgresIntrospectionFactory.create(config);
  return strategy.introspect();
}

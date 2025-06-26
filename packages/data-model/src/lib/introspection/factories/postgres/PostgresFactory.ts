import type { DataModelDef } from '../../../DataModel';
import { IntrospectionStrategy } from '../../IntrospectionStrategy';

import type { DbmlSchema } from './DbmlSchema';
import { SchemaFetcherDbml } from './SchemaFetcherDbml';
import { SchemaTransformerDbml } from './SchemaTransformerDbml';

export interface IntrospectionFactoryPostgresConfig {
  connectionString: string;
  databaseName?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  schemaFilter?: string[];
}

export class IntrospectionFactoryPostgres {
  static create(
    config: IntrospectionFactoryPostgresConfig,
  ): IntrospectionStrategy<DbmlSchema> {
    const fetcher = new SchemaFetcherDbml(config);
    const transformer = new SchemaTransformerDbml();

    const modelName =
      config.databaseName ?? this.extractDatabaseName(config.connectionString);

    return new IntrospectionStrategy(fetcher, transformer, modelName);
  }

  /**
   * Create with individual components for advanced usage (testing, customization)
   */
  static createAdvanced(
    fetcher: SchemaFetcherDbml,
    transformer: SchemaTransformerDbml,
    modelName: string,
  ): IntrospectionStrategy<DbmlSchema> {
    return new IntrospectionStrategy(fetcher, transformer, modelName);
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

export async function introspectPostgres(
  config: IntrospectionFactoryPostgresConfig,
): Promise<DataModelDef> {
  const strategy = IntrospectionFactoryPostgres.create(config);
  return strategy.introspect();
}

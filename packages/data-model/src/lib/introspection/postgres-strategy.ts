import type { DataModelDef } from '../data-model.js';

import type { DbmlSchema } from './dbml-types.js';
import {
  PostgresIntrospectionFactory,
  type PostgresIntrospectionFactoryConfig,
} from './postgres-factory.js';
import type { IntrospectionStrategy } from './types.js';

export interface PostgresIntrospectionConfig {
  connectionString: string;
  databaseName?: string;
}

/**
 * PostgreSQL introspection strategy implementation
 * @deprecated Use PostgresIntrospectionFactory.create() for new code
 */
export class PostgresIntrospectionStrategy
  implements IntrospectionStrategy<DbmlSchema>
{
  private readonly strategy: IntrospectionStrategy<DbmlSchema>;

  constructor(config: PostgresIntrospectionConfig) {
    // Convert old config format to new format
    const factoryConfig: PostgresIntrospectionFactoryConfig = {
      connectionString: config.connectionString,
      databaseName: config.databaseName,
      // Use default values for new options
      timeout: 30000, // 30 seconds default
      retries: 1,
    };

    this.strategy = PostgresIntrospectionFactory.create(factoryConfig);
  }

  async introspect(): Promise<DataModelDef> {
    return this.strategy.introspect();
  }
}

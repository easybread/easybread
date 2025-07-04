import {
  ConnectionError,
  InvalidConfigError,
  SchemaFetchError,
} from '../../IntrospectionError';
import { type SchemaFetcher } from '../../SchemaFetcher';

import type { DbmlSchema } from './DbmlSchema';

export interface SchemaFetcherPostgresConfig {
  connectionString: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  schemaFilter?: string[];
}

export class SchemaFetcherDbml implements SchemaFetcher<DbmlSchema> {
  private readonly config: SchemaFetcherPostgresConfig;

  constructor(config: SchemaFetcherPostgresConfig) {
    this.config = config;
    this.validateConfig();
  }

  async fetchSchema(): Promise<DbmlSchema> {
    const maxRetries = this.config.retries ?? 1;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.attemptFetch();
      } catch (error) {
        lastError = error;

        // Don't retry on configuration errors
        if (error instanceof InvalidConfigError) {
          throw error;
        }

        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          break;
        }

        // Wait before retrying
        if (this.config.retryDelay && this.config.retryDelay > 0) {
          await this.delay(this.config.retryDelay);
        }
      }
    }

    // If we get here, all retries failed
    throw new SchemaFetchError(
      `Failed to fetch PostgreSQL schema after ${maxRetries} attempts`,
      { cause: lastError },
    );
  }

  private async attemptFetch(): Promise<DbmlSchema> {
    try {
      // Dynamic import to avoid loading @dbml/connector unless needed
      const { connector } = await import('@dbml/connector');

      const timeoutPromise = this.config.timeout
        ? this.createTimeoutPromise(this.config.timeout)
        : null;

      const fetchPromise = connector.fetchSchemaJson(
        this.config.connectionString,
        'postgres',
      );

      const result = timeoutPromise
        ? await Promise.race([fetchPromise, timeoutPromise])
        : await fetchPromise;

      return this.validateAndCastSchema(result);
    } catch (error) {
      if (error instanceof Error) {
        // Convert known error types to our custom errors
        if (this.isConnectionError(error)) {
          throw new ConnectionError(
            'Failed to connect to PostgreSQL database',
            {
              cause: error,
            },
          );
        }

        if (this.isTimeoutError(error)) {
          throw new SchemaFetchError('Database query timed out', {
            cause: error,
          });
        }
      }

      throw new SchemaFetchError('Failed to fetch schema from PostgreSQL', {
        cause: error,
      });
    }
  }

  private validateConfig(): void {
    if (!this.config.connectionString) {
      throw new InvalidConfigError('Connection string is required');
    }

    if (typeof this.config.connectionString !== 'string') {
      throw new InvalidConfigError('Connection string must be a string');
    }

    try {
      const url = new URL(this.config.connectionString);
      if (url.protocol !== 'postgres:' && url.protocol !== 'postgresql:') {
        throw new InvalidConfigError(
          'Connection string must use postgres:// or postgresql:// protocol',
        );
      }
    } catch (error) {
      if (error instanceof InvalidConfigError) {
        throw error;
      }
      throw new InvalidConfigError('Invalid connection string format');
    }

    if (this.config.timeout !== undefined && this.config.timeout <= 0) {
      throw new InvalidConfigError('Timeout must be a positive number');
    }

    if (this.config.retries !== undefined && this.config.retries < 1) {
      throw new InvalidConfigError('Retries must be at least 1');
    }

    if (this.config.retryDelay !== undefined && this.config.retryDelay < 0) {
      throw new InvalidConfigError('Retry delay must be non-negative');
    }
  }

  private validateAndCastSchema(rawSchema: unknown): DbmlSchema {
    if (!rawSchema || typeof rawSchema !== 'object') {
      throw new SchemaFetchError(
        'Invalid schema format received from database',
      );
    }

    const schema = rawSchema as Record<string, unknown>;

    // Basic validation of required properties
    if (!Array.isArray(schema.tables)) {
      throw new SchemaFetchError('Schema missing required "tables" array');
    }

    if (!schema.fields || typeof schema.fields !== 'object') {
      throw new SchemaFetchError('Schema missing required "fields" object');
    }

    if (!Array.isArray(schema.refs)) {
      throw new SchemaFetchError('Schema missing required "refs" array');
    }

    if (!Array.isArray(schema.enums)) {
      throw new SchemaFetchError('Schema missing required "enums" array');
    }

    // Add more detailed validation as needed
    return rawSchema as DbmlSchema;
  }

  private createTimeoutPromise(timeoutMs: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private isConnectionError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return (
      message.includes('connection') ||
      message.includes('connect') ||
      message.includes('econnrefused') ||
      message.includes('enotfound') ||
      message.includes('etimedout')
    );
  }

  private isTimeoutError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return message.includes('timeout') || message.includes('timed out');
  }
}

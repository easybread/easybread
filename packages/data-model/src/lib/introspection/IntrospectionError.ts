// ========================================
// ERROR HIERARCHY
// ========================================

export abstract class IntrospectionError extends Error {
  readonly name: string;

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
export class ConnectionError extends IntrospectionError {}
export class UnknownError extends IntrospectionError {}

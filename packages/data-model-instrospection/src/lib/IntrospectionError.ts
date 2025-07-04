export abstract class IntrospectionError extends Error {
  public readonly timestamp = new Date().toISOString();

  readonly name: string;

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);

    this.name = new.target.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class InvalidConfigError extends IntrospectionError {}
export class SchemaFetchError extends IntrospectionError {}
export class TransformationError extends IntrospectionError {}
export class ConnectionError extends IntrospectionError {}
export class UnknownError extends IntrospectionError {}

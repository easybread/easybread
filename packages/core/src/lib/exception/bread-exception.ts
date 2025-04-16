/// <reference lib="es2022.error" />
export class BreadException extends Error {
  public readonly timestamp = new Date().toISOString();

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);

    this.name = new.target.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON(): object {
    return this.toObject();
  }

  toObject(): object {
    return {
      ...this.valueOf(),
      timestamp: this.timestamp,
      name: this.name,
      message: this.message,
    };
  }
}

/// <reference lib="es2022.error" />
export class BreadException<T extends string = string> extends Error {
  public override readonly name: T;
  public readonly timestamp = new Date().toISOString();

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);

    this.name = new.target.name as T;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return this.toObject();
  }

  toObject() {
    return {
      ...this.valueOf(),
      timestamp: this.timestamp,
      name: this.name,
      message: this.message,
    };
  }
}

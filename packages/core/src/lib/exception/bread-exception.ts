export class BreadException extends Error {
  constructor(message: string) {
    super(message);
  }

  toJSON(): object {
    return {
      ...this.valueOf(),
      name: this.constructor.name,
      message: this.message,
    };
  }

  toObject(): object {
    return {
      ...this.valueOf(),
      name: this.constructor.name,
      message: this.message,
    };
  }
}

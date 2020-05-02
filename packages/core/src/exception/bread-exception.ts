export class BreadException extends Error {
  constructor(message: string) {
    super(message);
  }

  toJSON(): object {
    return {
      ...this.valueOf(),
      message: this.message
    };
  }

  toObject(): object {
    return {
      ...this.valueOf(),
      message: this.message
    };
  }
}

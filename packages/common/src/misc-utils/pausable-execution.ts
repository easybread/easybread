type ResolveFunction = (value?: void | PromiseLike<void> | undefined) => void;
type AsyncFunction<T> = () => Promise<T>;

export class PausableExecution {
  public isPaused = false;

  private promise: Promise<unknown> | null = Promise.resolve();
  private resolve: null | ResolveFunction = null;

  pause(): void {
    this.isPaused = true;
    this.promise = new Promise(resolve => (this.resolve = resolve));
  }

  resume(): void {
    const resolve = this.resolve;
    this.isPaused = false;
    this.resolve = null;
    this.promise = null;
    resolve && resolve();
  }

  async add<T>(asyncFunction: AsyncFunction<T>): Promise<T> {
    if (this.isPaused) await this.promise;
    return asyncFunction();
  }
}

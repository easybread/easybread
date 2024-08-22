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
    if (!this.isPaused) return;

    const resolve = this.resolve;
    this.isPaused = false;
    this.resolve = null;
    this.promise = null;
    resolve && resolve();
  }

  async add<T>(asyncFunction: AsyncFunction<T>): Promise<T> {
    // TODO: revisit the implementation and usage.
    //  Currently, `add` is misleading,
    //  since it doesn't actually add the fn to the execution queue when paused.
    if (this.isPaused) await this.promise;
    return asyncFunction();
  }
}

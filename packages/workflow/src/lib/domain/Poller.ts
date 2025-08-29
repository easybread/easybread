type PollerResult<TCallback> = TCallback extends (data: infer P) => any
  ? Promise<P>
  : Promise<void>;

type PollerCallback = (...args: any[]) => any;

export abstract class Poller<TCallback extends PollerCallback = () => void> {
  static NOOP_CALLBACK = () => void 0;
  static DEFAILT_DELAY = 100;

  protected readonly delay: number;

  private callback: TCallback | null = null;
  private state: 'IDLE' | 'ACTIVE' | 'DESTROYED' = 'IDLE';

  get isActive() {
    return this.state === 'ACTIVE';
  }

  protected constructor(callback: TCallback, delay = Poller.DEFAILT_DELAY) {
    this.callback = callback;
    this.delay = delay;
  }

  start() {
    if (this.state === 'ACTIVE') {
      return;
    }

    if (this.state === 'DESTROYED') {
      throw new Error('Cannot start a subscription that is destroyed');
    }

    this.state = 'ACTIVE';
    this.startInfiniteLoop();
  }

  destroy() {
    this.state = 'DESTROYED';
    this.callback = null;
  }

  stop() {
    this.state = 'IDLE';
  }

  private async startInfiniteLoop() {
    while (this.isActive) {
      await this.iteration();
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }
  }

  private async iteration() {
    const data = await this.poll();
    await this.callback?.(data);
  }

  protected abstract poll(): PollerResult<TCallback>;
}

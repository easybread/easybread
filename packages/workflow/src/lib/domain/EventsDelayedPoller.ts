import type { EventStore } from '../stores/EventStore';

import { Poller } from './Poller';

export class DelayedQueuePoller extends Poller {
  static DEFAULT_DELAY = 1000;

  private readonly eventStore: EventStore;
  private readonly execId: string;

  constructor(
    eventStore: EventStore,
    execId: string,
    delay = DelayedQueuePoller.DEFAULT_DELAY,
  ) {
    super(Poller.NOOP_CALLBACK, delay);
    this.eventStore = eventStore;
    this.execId = execId;
  }

  protected async poll() {
    await this.eventStore.reProcessDelayed(this.execId);
  }
}

import type { UnsubscribeFn } from '../WorkflowStoreAdapter';
import type { EventStore } from '../stores/EventStore';

import type { EventMatchPattern } from './EventMatchPattern';
import type { WorkflowEventAny } from './WorkflowEvent';

export class EventStoreSubscription {
  static make(
    eventStore: EventStore,
    pattern: EventMatchPattern,
    callback: (event: WorkflowEventAny) => void,
  ) {
    return new EventStoreSubscription(eventStore, pattern, callback);
  }

  private readonly eventStore: EventStore;
  private readonly pattern: EventMatchPattern;
  private callback: (event: WorkflowEventAny) => void;
  private unsubscribe: UnsubscribeFn | null = null;

  private state: 'IDLE' | 'ACTIVE' | 'DESTROYED' = 'IDLE';

  get isActive() {
    return this.state === 'ACTIVE';
  }

  private constructor(
    eventStore: EventStore,
    pattern: EventMatchPattern,
    callback: (event: WorkflowEventAny) => void,
  ) {
    this.eventStore = eventStore;
    this.pattern = pattern;
    this.callback = callback;
  }

  start() {
    if (this.state === 'ACTIVE') {
      return;
    }

    if (this.state === 'DESTROYED') {
      throw new Error('Cannot start a subscription that is destroyed');
    }

    this.state = 'ACTIVE';

    this.unsubscribe = this.eventStore.subscribe(['CREATE', 'UPDATE'], _ =>
      this.iteration(),
    );
  }

  destroy() {
    this.state = 'DESTROYED';
    this.callback = _ => void 0;
    this.unsubscribe?.();
    this.unsubscribe = null;
  }

  stop() {
    this.state = 'IDLE';
    this.unsubscribe?.();
    this.unsubscribe = null;
  }

  private async iterate() {
    while (this.isActive) {
      await this.iteration();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  private async iteration() {
    const events = await this.eventStore.readQueued(this.pattern.execId);
  }
}

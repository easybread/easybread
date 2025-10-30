import type { EventStore } from '../stores/EventStore';

import { Poller } from './Poller';
import type { WorkflowEventAny } from './WorkflowEvent';
import type { EventKeyPattern } from './keyPatterns/EventKeyPattern';

export class EventsReadyPoller extends Poller<
  (events: WorkflowEventAny[]) => void
> {
  private readonly eventStore: EventStore;
  private readonly pattern: EventKeyPattern;

  constructor(
    eventStore: EventStore,
    pattern: EventKeyPattern,
    callback: (events: WorkflowEventAny[]) => void,
    delay?: number,
  ) {
    super(callback, delay);
    this.eventStore = eventStore;
    this.pattern = pattern;
  }

  protected poll() {
    return this.eventStore.claimForProcessing(this.pattern);
  }
}

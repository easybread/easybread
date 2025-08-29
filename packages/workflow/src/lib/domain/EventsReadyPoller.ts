import type { EventStore } from '../stores/EventStore';

import type { EventMatchPattern } from './KeyPattern';
import { Poller } from './Poller';
import type { WorkflowEventAny } from './WorkflowEvent';

export class EventsReadyPoller extends Poller<
  (events: WorkflowEventAny[]) => void
> {
  private readonly eventStore: EventStore;
  private readonly pattern: EventMatchPattern;

  constructor(
    eventStore: EventStore,
    pattern: EventMatchPattern,
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

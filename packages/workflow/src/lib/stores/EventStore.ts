import { WorkflowStore } from '../WorkflowStore';
import type { WorkflowStoreAdapter } from '../WorkflowStoreAdapter';
import {
  EventMatchPattern,
  type EventMatchPatternOptions,
} from '../domain/EventMatchPattern';
import {
  WorkflowEvent,
  type WorkflowEventAny,
  type WorkflowEventJSON,
} from '../domain/WorkflowEvent';

/**
 * Store for events that are rescheduled for processing later.
 * @private
 */
class _EventRescheduleStore extends WorkflowStore {
  constructor(adapter: WorkflowStoreAdapter) {
    super('EVENT_RESCHEDULE', adapter);
  }

  async add(execId: string, itemKey: string, delayMS: number) {
    const currentTimeMS = await this.adapter.timeMS();
    const key = this.encodeStoreKey(execId);

    await this.adapter.addScored(key, itemKey, currentTimeMS + delayMS);
  }

  async remove(execId: string, itemKey: string) {
    const key = this.encodeStoreKey(execId);

    await this.adapter.removeScored(key, itemKey);
  }

  async claimDueItems(execId: string) {
    const key = this.encodeStoreKey(execId);
    const currentTimeMS = await this.adapter.timeMS();

    return await this.adapter.withLock(key, async store => {
      const items = await store.getScored(key, { max: currentTimeMS });
      await store.removeScoredUpTo(key, { max: currentTimeMS });
      return items;
    });
  }
}

/**
 * Store for events that are in progress to prevent double processing
 * @private
 */
class _EventInProgressStore extends WorkflowStore {
  constructor(adapter: WorkflowStoreAdapter) {
    super('EVENT_IN_PROGRESS', adapter);
  }
}

export class EventStore extends WorkflowStore {
  static executionBasedPattern(execId: string) {
    return WorkflowEvent.encodePK({
      execId,
      name: EventMatchPattern.WILDCARDS.ONE_SEGMENT,
      nodeId: EventMatchPattern.WILDCARDS.ONE_SEGMENT,
      fiberKey: EventMatchPattern.WILDCARDS.ONE_SEGMENT,
    });
  }

  static makePattern(options: EventMatchPatternOptions) {
    const { execId, eventName, nodeId, fiberKey } = options;
    return [execId, eventName, nodeId, fiberKey].join(':');
  }

  private readonly rescheduleStore: _EventRescheduleStore;
  private readonly inProgressStore: _EventInProgressStore;

  constructor(adapter: WorkflowStoreAdapter) {
    super('EVENT', adapter);
    this.rescheduleStore = new _EventRescheduleStore(adapter);
    this.inProgressStore = new _EventInProgressStore(adapter);
  }

  async estimateEventCount(pattern: EventMatchPattern) {
    const encodedPattern = this.encodeStoreKey(pattern.toString());
    let count = 0;
    for await (const _ of this.adapter.keysGenerator(encodedPattern)) {
      count++;
    }
    return count;
  }

  async writeEvents(events: WorkflowEventAny[]) {
    for (const event of events) {
      const storeKey = this.encodeStoreKey(WorkflowEvent.encodePK(event));
      await this.adapter.set(storeKey, event.toJSON());
    }
  }

  async ack(event: WorkflowEventAny) {
    const storeKey = this.encodeStoreKey(WorkflowEvent.encodePK(event));
    await this.adapter.remove(storeKey);
  }

  async readQueued(execId: string, maxCount = 100) {}

  async readEvents(pattern: EventMatchPattern) {
    const events: WorkflowEventAny[] = [];
    const encodedPattern = this.encodeStoreKey(pattern.toString());

    for await (const key of this.adapter.keysGenerator(encodedPattern)) {
      const event = await this.adapter.get<WorkflowEventJSON>(key);
      if (event) {
        events.push(WorkflowEvent.fromJSON(event));
      }
    }

    return events;
  }

  async rescheduleEvent(event: WorkflowEventAny, delayMs: number) {
    throw new Error('Method not implemented.');
  }

  async lockKey(key: string) {
    // prevent events from being read and their keys to be enumerated
    // how? hmm...
    throw new Error('not implemnted');
  }

  async unlockKey(key: string) {
    throw new Error('not implemented');
  }

  async isLockedKey(key: string): Promise<boolean> {
    throw new Error('not implemented');
  }
}

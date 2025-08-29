import { WorkflowStore } from '../WorkflowStore';
import type { WorkflowStoreAdapter } from '../WorkflowStoreAdapter';
import {
  EventMatchPattern,
  type EventMatchPatternOptions,
} from '../domain/KeyPattern';
import {
  WorkflowEvent,
  type WorkflowEventAny,
  type WorkflowEventJSON,
} from '../domain/WorkflowEvent';

/**
 * Store for events that are delayed for processing later.
 * @private
 */
class _EventsDelayedStore extends WorkflowStore {
  constructor(adapter: WorkflowStoreAdapter) {
    super('EVENTS_DELAYED', adapter);
  }

  async addKeys(execId: string, itemKey: string, delayMS: number) {
    const currentTimeMS = await this.adapter.timeMS();
    const scoredListKey = this.encodeStoreKey(execId);

    await this.adapter.addScored(
      scoredListKey,
      itemKey,
      currentTimeMS + delayMS,
    );
  }

  async removeKeys(execId: string, itemKey: string) {
    const scoredListKey = this.encodeStoreKey(execId);
    await this.adapter.removeScored(scoredListKey, itemKey);
  }

  async claimDueKeys(execId: string) {
    const scoredListKey = this.encodeStoreKey(execId);
    const currentTimeMS = await this.adapter.timeMS();

    return await this.adapter.withLock(scoredListKey, async store => {
      const delayedKeys = await store.getScored(scoredListKey, {
        max: currentTimeMS,
      });
      await store.removeScoredMany(scoredListKey, delayedKeys);

      return delayedKeys;
    });
  }
}

/**
 * Store for events that are in progress to prevent double processing
 * @private
 */
class _EventsProcessingStore extends WorkflowStore {
  constructor(adapter: WorkflowStoreAdapter) {
    super('EVENTS_PROCESSING', adapter);
  }

  async addKeys(execId: string, storeKeys: string[]) {
    const currentTimeMS = await this.adapter.timeMS();
    const encodedKey = this.encodeStoreKey(execId);
    await this.adapter.addScoredMany(encodedKey, storeKeys, currentTimeMS);
  }

  async removeKeys(execId: string, storeKeys: string[]) {
    const encodedKey = this.encodeStoreKey(execId);
    await this.adapter.removeScoredMany(encodedKey, storeKeys);
  }
}

/**
 * Store for events that are ready for processing
 * @private
 */
class _EventsReadyStore extends WorkflowStore {
  constructor(adapter: WorkflowStoreAdapter) {
    super('EVENTS_READY', adapter);
  }

  async addKeys(execId: string, keys: string[]) {
    const currentTimeMS = await this.adapter.timeMS();
    const encodedKey = this.encodeStoreKey(execId);
    await this.adapter.addScoredMany(encodedKey, keys, currentTimeMS);
  }

  async readKeys(execId: string) {
    const encodedKey = this.encodeStoreKey(execId);
    const currentTimeMS = await this.adapter.timeMS();
    return await this.adapter.getScored(encodedKey, { max: currentTimeMS });
  }

  async removeKeys(execId: string, keys: string[]) {
    const encodedKey = this.encodeStoreKey(execId);
    await this.adapter.removeScoredMany(encodedKey, keys);
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

  private readonly delayedStore: _EventsDelayedStore;
  private readonly processingStore: _EventsProcessingStore;
  private readonly readyStore: _EventsReadyStore;

  constructor(adapter: WorkflowStoreAdapter) {
    super('EVENT', adapter);
    this.delayedStore = new _EventsDelayedStore(adapter);
    this.processingStore = new _EventsProcessingStore(adapter);
    this.readyStore = new _EventsReadyStore(adapter);
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
    let execId: string | null = null;
    const kvPairs: [string, WorkflowEventJSON][] = [];

    for (const event of events) {
      if (execId === null) {
        execId = event.execId;
      }

      if (execId !== event.execId) {
        throw new Error('Cannot write events for multiple execIds');
      }

      kvPairs.push([
        this.encodeStoreKey(WorkflowEvent.encodePK(event)),
        event.toJSON(),
      ]);
    }

    if (execId === null) {
      throw new Error('Unexpected empty execId');
    }

    await this.rwLock.usingWriteLock(this.encodeStoreKey(execId), async () => {
      await Promise.all([
        this.adapter.setMany<WorkflowEventJSON>(kvPairs),
        this.readyStore.addKeys(
          execId,
          kvPairs.map(([key]) => key),
        ),
      ]);
    });
  }

  async ack(event: WorkflowEventAny) {
    const storeKey = this.encodeStoreKey(WorkflowEvent.encodePK(event));
    await this.rwLock.usingWriteLock(storeKey, async () =>
      Promise.all([
        this.adapter.remove(storeKey),
        this.processingStore.removeKeys(event.execId, [storeKey]),
      ]),
    );
  }

  async reProcessDelayed(execId: string) {
    const delayedKeys = await this.delayedStore.claimDueKeys(execId);
    await this.readyStore.addKeys(execId, delayedKeys);
  }

  async claimForProcessing(pattern: EventMatchPattern) {
    const matchedKeys = await this.rwLock.usingWriteLock(
      this.encodeStoreKey(pattern.toString()),
      async () => {
        const keys = await this.readyStore.readKeys(pattern.execId);
        const matchedKeys = pattern.matchKeys(keys);

        if (matchedKeys.length > 0) {
          await Promise.all([
            this.readyStore.removeKeys(pattern.execId, matchedKeys),
            this.processingStore.addKeys(pattern.execId, matchedKeys),
          ]);
        }

        return matchedKeys;
      },
    );

    return await this.readMany(matchedKeys);
  }

  async rescheduleEvent(event: WorkflowEventAny, delayMs: number) {
    const storeKey = this.encodeStoreKey(WorkflowEvent.encodePK(event));
    await this.rwLock.usingWriteLock(storeKey, async () =>
      Promise.all([
        this.processingStore.removeKeys(event.execId, [storeKey]),
        this.delayedStore.addKeys(event.execId, storeKey, delayMs),
      ]),
    );
  }

  private async readMany(keys: string[]) {
    const encodedKeys = keys.map(this.encodeStoreKey);
    const data = await this.adapter.getMany<WorkflowEventJSON>(encodedKeys);

    return data.map(eventJson => WorkflowEvent.fromJSON(eventJson));
  }
}

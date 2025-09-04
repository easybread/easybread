import type { ServiceRegistry } from '../ServiceRegistry';
import { Store } from '../Store';
import { EventKeyPattern } from '../domain/EventKeyPattern';
import {
  WorkflowEvent,
  type WorkflowEventAny,
  type WorkflowEventJSON,
} from '../domain/WorkflowEvent';

/**
 * Store for events that are delayed for processing later.
 * @private
 */
class _EventsDelayedStore extends Store {
  constructor(serviceRegistry: ServiceRegistry) {
    super(serviceRegistry, 'EVENTS_DELAYED');
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
class _EventsProcessingStore extends Store {
  constructor(serviceRegistry: ServiceRegistry) {
    super(serviceRegistry, 'EVENTS_PROCESSING');
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
class _EventsReadyStore extends Store {
  constructor(serviceRegistry: ServiceRegistry) {
    super(serviceRegistry, 'EVENTS_READY');
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

export class EventStore extends Store {
  private readonly delayedStore: _EventsDelayedStore;
  private readonly processingStore: _EventsProcessingStore;
  private readonly readyStore: _EventsReadyStore;

  constructor(serviceRegistry: ServiceRegistry) {
    super(serviceRegistry, 'EVENT');
    this.delayedStore = new _EventsDelayedStore(serviceRegistry);
    this.processingStore = new _EventsProcessingStore(serviceRegistry);
    this.readyStore = new _EventsReadyStore(serviceRegistry);
  }

  async estimateEventCount(pattern: EventKeyPattern) {
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

  async claimForProcessing(pattern: EventKeyPattern) {
    const matchedKeys = await this.rwLock.usingWriteLock(
      this.encodeStoreKey(pattern.toString()),
      async () => {
        const keys = await this.readyStore.readKeys(pattern.execId);
        const matchedKeys = pattern.filter(keys);

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

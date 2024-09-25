import type {
  BreadEvent,
  BreadEventByName,
  BreadEventName,
} from './bread.event';
import type { IfElse, Includes } from '@easybread/common';

export type BreadEventSubscriber<T extends BreadEvent> = T extends BreadEvent
  ? { bivarianceHack(event: T): void | Promise<void> }['bivarianceHack']
  : never;

type DeregisterFn = () => unknown;

/**
 * A simple type-safe event bus.
 * Use standalone or inherit in other classes.
 *
 * @template TEvent event type. Usually, a union.
 */
export class BreadEventBus<TEvent extends BreadEvent> {
  private subscribers = new Map<
    BreadEventName<TEvent>,
    Set<BreadEventSubscriber<TEvent>>
  >();

  private children = new Set<BreadEventBus<BreadEvent>>();

  /**
   * Forward events from this event bus the the given event bus.
   * at least all events that this event bus supports.
   *
   * @template TChildEvent event type (usually, a union)
   * that the child event bus supports
   *
   * @param childEventBus
   *
   * @returns "un-forward" function
   */
  forwardEvents<TChildEvent extends BreadEvent>(
    childEventBus: IfElse<
      Includes<TChildEvent, TEvent>,
      BreadEventBus<TChildEvent>
    >
  ): DeregisterFn {
    this.children.add(childEventBus);
    return () => this.children.delete(childEventBus);
  }

  /**
   * Stop forwarding events from this event bus to all child event buses.
   */
  stopForwardingEvents() {
    this.children.clear();
  }

  /**
   * Subscribe to an event by event name.
   *
   * @param eventName event name
   * @param subscriber subscriber function
   *
   * @returns unsubscribe function
   */
  subscribe<TName extends BreadEventName<TEvent>>(
    eventName: TName,
    subscriber: BreadEventSubscriber<BreadEventByName<TEvent, TName>>
  ): DeregisterFn {
    const listeners = this.subscribers.get(eventName);
    const unsubscribe = () => this.unsubscribe(eventName, subscriber);

    if (!listeners) {
      this.subscribers.set(eventName, new Set([subscriber]));
      return unsubscribe;
    }

    listeners.add(subscriber);

    return unsubscribe;
  }

  /**
   * Publish an event to all subscribers.
   *
   * @param event
   */
  publish<T extends TEvent>(event: T) {
    this.subscribers.get(event.name)?.forEach((s) => s(event));
    this.children.forEach((c) => c.publish(event));
  }

  /**
   * Unsubscribe from an event by event name.
   *
   * @param eventName
   * @param listener
   */
  unsubscribe<TName extends BreadEventName<TEvent>>(
    eventName: TName,
    listener: BreadEventSubscriber<BreadEventByName<TEvent, TName>>
  ) {
    this.subscribers.get(eventName)?.delete(listener);
  }

  /**
   * Remove all subscribers.
   */
  unsubscribeAll() {
    this.subscribers.clear();
  }
}

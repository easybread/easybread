import { BreadEvent } from './bread.event';
import { BreadEventBus } from './bread-event.bus';

class EventOne extends BreadEvent<{ foo: number }> {
  readonly name = 'EventOne';
}
class EventTwo extends BreadEvent<{ bar: string }> {
  readonly name = 'EventTwo';
}

it(`should have name getter on an event instance that returns the name of the class`, () => {
  const event = new EventOne({ foo: 1 });
  expect(event.name).toEqual('EventOne');
});

it(`should notify subscribers`, async () => {
  const eventBus = new BreadEventBus<EventOne | EventTwo>();
  const spyOne = jest.fn();
  const spyTwo = jest.fn();

  // subscribe spyOne to both events
  eventBus.subscribe('EventOne', spyOne);
  eventBus.subscribe('EventTwo', spyOne);

  // subscribe spyTwo to EventOne only
  eventBus.subscribe('EventOne', spyTwo);

  eventBus.publish(new EventOne({ foo: 1 }));
  eventBus.publish(new EventTwo({ bar: 'bar' }));

  expect(spyOne).toHaveBeenCalledTimes(2);
  expect(spyOne).toHaveBeenCalledWith(new EventOne({ foo: 1 }));
  expect(spyOne).toHaveBeenCalledWith(new EventTwo({ bar: 'bar' }));

  expect(spyTwo).toHaveBeenCalledTimes(1);
  expect(spyTwo).toHaveBeenCalledWith(new EventOne({ foo: 1 }));
});

it(`should unsubscribe`, async () => {
  const eventBus = new BreadEventBus<EventOne | EventTwo>();
  const spyFoo = jest.fn();
  const spyBar = jest.fn();

  // subscribe spyFoo to both events
  eventBus.subscribe('EventOne', spyFoo);
  const unsubscribeFooFromEventTwo = eventBus.subscribe('EventTwo', spyFoo);

  // subscribe spyBar to EventOne only
  const unsubscribeBarFromEventOne = eventBus.subscribe('EventOne', spyBar);

  unsubscribeFooFromEventTwo();
  unsubscribeBarFromEventOne();

  eventBus.publish(new EventOne({ foo: 1 }));
  eventBus.publish(new EventTwo({ bar: 'bar' }));

  expect(spyFoo).toHaveBeenCalledTimes(1);
  expect(spyFoo).toHaveBeenCalledWith(new EventOne({ foo: 1 }));

  expect(spyBar).toHaveBeenCalledTimes(0);
});

it(`should remove all listeners`, async () => {
  const eventBus = new BreadEventBus<EventOne | EventTwo>();
  const spyFoo = jest.fn();
  const spyBar = jest.fn();

  // subscribe spyFoo to both events
  eventBus.subscribe('EventOne', spyFoo);
  eventBus.subscribe('EventTwo', spyFoo);

  // subscribe spyBar to EventOne only
  eventBus.subscribe('EventOne', spyBar);

  eventBus.unsubscribeAll();

  eventBus.publish(new EventOne({ foo: 1 }));
  eventBus.publish(new EventTwo({ bar: 'bar' }));

  expect(spyFoo).toHaveBeenCalledTimes(0);
  expect(spyBar).toHaveBeenCalledTimes(0);
});

it(`should forward all events`, () => {
  const childBus = new BreadEventBus<EventOne | EventTwo>();
  const parentBus = new BreadEventBus<EventOne>();

  parentBus.forwardEvents(childBus);

  const spy = jest.fn();
  childBus.subscribe('EventOne', spy);

  parentBus.publish(new EventOne({ foo: 1 }));

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith(new EventOne({ foo: 1 }));
});

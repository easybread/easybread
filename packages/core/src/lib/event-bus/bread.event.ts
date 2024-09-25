export abstract class BreadEvent<T = unknown> {
  abstract readonly name: string;

  constructor(public readonly payload: T) {}
}

export type BreadEventName<T extends BreadEvent> = T['name'];

export type BreadEventByName<
  TEventUnion extends BreadEvent,
  TName extends string
> = Extract<TEventUnion, { readonly name: TName }>;

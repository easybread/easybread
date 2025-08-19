import { type Tag, isTagged, tagged } from './tag';

export type None = Tag<'None'>;
export type Some<T> = Tag<'Some'> & { value: T };
export type Option<T> = None | Some<T>;

export type NoneJSON = { readonly _tag: 'None' };
export type SomeJSON<T> = { readonly _tag: 'Some'; readonly value: T };
export type OptionJSON<T> = SomeJSON<T> | NoneJSON;

export type OptionJSONFromOption<O extends Option<any>> =
  O extends Some<infer T> ? SomeJSON<T> : NoneJSON;

export type OptionFromOptionJSON<J extends OptionJSON<any>> =
  J extends SomeJSON<infer T> ? Some<T> : None;

export const Option = {
  match<T, RSome, RNone>(
    option: Option<T>,
    match: {
      onSome: (value: T) => RSome;
      onNone: () => RNone;
    },
  ): RSome | RNone {
    if (Option.isNone(option)) return match.onNone();
    return match.onSome(option.value);
  },

  none(): None {
    return tagged('None');
  },

  some<T>(value: T): Some<T> {
    return tagged('Some', { value });
  },

  isOption(value: any): value is Option<unknown> {
    return isTagged(value, 'None') || isTagged(value, 'Some');
  },

  isNone(value: unknown): value is None {
    return isTagged(value, 'None');
  },

  isSome<T>(value: unknown): value is Some<T> {
    return isTagged(value, 'Some');
  },

  toJSON<O extends Option<any>>(option: O): OptionJSONFromOption<O> {
    if (Option.isNone(option)) {
      return { _tag: 'None' } as any;
    }
    return { _tag: 'Some', value: option.value } as any;
  },

  fromJSON<J extends OptionJSON<any>>(json: J): OptionFromOptionJSON<J> {
    if (json._tag === 'Some') {
      return Option.some(json.value) as any;
    }
    return Option.none() as any;
  },

  unwrap<T extends Option<unknown>>(
    value: T,
  ): T extends Some<infer U> ? U : never {
    if (Option.isNone(value)) throw new Error('Cannot unwrap None');
    return value.value as any;
  },
};

import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

export const SEGMENT_MACRO = enumSuiteObject(enumObject(['P', 'S']));
export type SegmentMacro = typeof SEGMENT_MACRO.$type;

type KeyTemplateSegment<T extends SegmentMacro, P extends string> = {
  macro: T;
  propName: P;
};

type KeyTemplateSegmentAny = KeyTemplateSegment<SegmentMacro, string>;

type inferKeyTemplateSegment<T extends string> =
  T extends `${infer Macro extends SegmentMacro}(${infer PropName extends string})`
    ? KeyTemplateSegment<Macro, PropName>
    : KeyTemplateSegmentAny;

type inferKeyTemplateSegments<T extends string> =
  T extends `${infer A}:${infer R}`
    ? [inferKeyTemplateSegment<A>, ...inferKeyTemplateSegments<R>]
    : [inferKeyTemplateSegment<T>];

type IsNonEmptyArray<T extends readonly any[]> = T extends [
  infer _ extends any,
  ...infer __ extends any[],
]
  ? true
  : false;

type inferPatternProps<T extends readonly KeyTemplateSegmentAny[]> = T extends [
  infer S extends KeyTemplateSegmentAny,
  ...infer R extends readonly KeyTemplateSegmentAny[],
]
  ? IsNonEmptyArray<R> extends true
    ? { [K in S['propName']]: string } & inferPatternProps<R>
    : { [K in S['propName']]: string }
  : never;

export type KeyPatternWildcardChar =
  (typeof KeyPattern.WILDCARDS)[keyof typeof KeyPattern.WILDCARDS];

// TODO: move to shared utilities
type NoWidenAnyString = string & { readonly __nominal?: never };

export type Wildcardable<T extends string> = string extends T
  ? KeyPatternWildcardChar | NoWidenAnyString
  : KeyPatternWildcardChar | T;

type WithPatternTemplate<T extends string> = {
  readonly PATTERN_TEMPLATE: T;
};

export class KeyPattern<T extends string> {
  static readonly WILDCARDS = {
    ANY_SEGMENT: '*',
  } as const;

  static isWirdcard(char: string): char is KeyPatternWildcardChar {
    return Object.values(this.WILDCARDS).includes(char as any);
  }

  static forPreset<T extends string>(
    template: T,
  ): typeof KeyPattern<T> & WithPatternTemplate<T> {
    return Object.assign(this<T>, Object.seal({ PATTERN_TEMPLATE: template }));
  }

  static createFactoryMethod<
    T extends string,
    This extends typeof KeyPattern<T>,
  >(this: This, template: T) {
    return (props: inferPatternProps<inferKeyTemplateSegments<T>>) => {
      return new this(
        this.parseTemplateSegments(template),
        props,
      ) as InstanceType<This>;
    };
  }

  static parseTemplateSegments<T extends string>(
    keyDef: T,
  ): inferKeyTemplateSegments<T> {
    const segments = keyDef.split(':');

    return segments.map(segment => {
      const [macro, propName] = segment.split('(');

      if (!macro || !propName) {
        throw new Error(`Invalid segment: ${segment}`);
      }

      if (!SEGMENT_MACRO.hasValue(macro)) {
        throw new Error(`Invalid macro: ${macro}`);
      }

      return { macro, propName };
    }) as inferKeyTemplateSegments<T>;
  }

  static makeWildcardedPathSegment(options: {
    prefixWildcard?: KeyPatternWildcardChar;
    partial: string;
    suffixWildcard?: KeyPatternWildcardChar;
  }) {
    return [options.prefixWildcard, options.partial, options.suffixWildcard]
      .filter(part => part != null)
      .join('/')
      .replace(/\/+/g, '/');
  }

  protected readonly templateSegments: inferKeyTemplateSegments<T>;
  protected readonly props: inferPatternProps<inferKeyTemplateSegments<T>>;

  constructor(
    segments: inferKeyTemplateSegments<T>,
    props: inferPatternProps<inferKeyTemplateSegments<T>>,
  ) {
    this.templateSegments = segments;
    this.props = props;
  }

  toString() {
    return this.templateSegments
      .map(segment => this.props[segment.propName])
      .join(':');
  }

  match(key: string) {
    return true;
  }
  matchMany(keys: string[]) {
    return keys.filter(key => this.match(key));
  }

  protected toMinimatch(segment: KeyTemplateSegmentAny) {
    // TODO: implement
    return 'minimatch string';
  }
}

//----------------------------------

export class EventMatchPattern extends KeyPattern.forPreset(
  'S(execId):S(eventName):P(nodeId):P(fiberKey)',
) {
  static make = this.createFactoryMethod(this.PATTERN_TEMPLATE);

  get execId() {
    return this.props.execId;
  }
}

export class FiberMatchPattern extends KeyPattern.forPreset(
  'S(execId):P(fiberKey)',
) {
  static make = this.createFactoryMethod(this.PATTERN_TEMPLATE);
}

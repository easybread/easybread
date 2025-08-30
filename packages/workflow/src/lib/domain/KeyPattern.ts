import { enumObject, enumSuiteObject } from '@space-architects/util-enum';
import { minimatch } from 'minimatch';

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

type WithPatternTemplate<T extends string> = {
  readonly PATTERN_TEMPLATE: T;
};

export class KeyPattern<T extends string> {
  static readonly WILDCARDS = {
    ONE_SEGMENT: '*',
    MULTIPLE_SEGMENTS: '**',
  } as const;

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
      const match = /(P|S)\((.*?)\)/.exec(segment);

      if (!match) {
        throw new Error(`Invalid segment: ${segment}`);
      }

      const [_, macro, propName] = match;

      if (!SEGMENT_MACRO.hasValue(macro)) {
        throw new Error(`Invalid macro: ${macro}`);
      }

      return { macro, propName };
    }) as inferKeyTemplateSegments<T>;
  }

  static makePathSegmentWildcardByPrefix(prefix: string) {
    return this.makePathSegment([
      prefix,
      KeyPattern.WILDCARDS.ONE_SEGMENT,
      KeyPattern.WILDCARDS.MULTIPLE_SEGMENTS,
    ]);
  }

  static makePathSegment(parts: string[]) {
    return parts.join('/');
  }

  readonly templateSegments: inferKeyTemplateSegments<T>;
  readonly props: inferPatternProps<inferKeyTemplateSegments<T>>;
  readonly minimatchPatterns: Record<string, string>;

  constructor(
    segments: inferKeyTemplateSegments<T>,
    props: inferPatternProps<inferKeyTemplateSegments<T>>,
  ) {
    this.templateSegments = segments;
    this.props = props;
    this.minimatchPatterns = this.createMinimatchPatterns();
  }

  toString() {
    return this.templateSegments
      .map(segment => this.props[segment.propName])
      .join(':');
  }

  matchKey(key: string) {
    const keyParts = key.split(':');

    if (keyParts.length !== this.templateSegments.length) return false;

    return this.templateSegments.every((segment, index) => {
      const keyPart = keyParts[index];
      const propValue = this.props[segment.propName];
      const minimatchPattern = this.minimatchPatterns[segment.propName];

      if (propValue === KeyPattern.WILDCARDS.ONE_SEGMENT) return true;
      if (minimatchPattern) return minimatch(keyPart, minimatchPattern);

      return keyPart === propValue;
    });
  }

  filter(keys: string[]) {
    return keys.filter(key => this.matchKey(key));
  }

  protected createMinimatchPatterns() {
    return this.templateSegments.reduce(
      (result, segment) => {
        const propValue = this.props[segment.propName];

        if (propValue === KeyPattern.WILDCARDS.ONE_SEGMENT) return result;
        if (!propValue.includes(KeyPattern.WILDCARDS.ONE_SEGMENT))
          return result;

        result[segment.propName] = this.createMinimatchForSegment(segment);

        return result;
      },
      {} as Record<string, string>,
    );
  }

  protected createMinimatchForSegment(segment: KeyTemplateSegmentAny) {
    const { propName, macro } = segment;
    const propValue = this.props[propName];

    switch (macro) {
      case 'S':
        return this.toMinimatch(propValue);
      case 'P':
        return this.toMinimatch(this.preparePathForMinimatch(propValue));
      default:
        throw new Error(`Invalid macro: ${macro satisfies never}`);
    }
  }

  protected preparePathForMinimatch(path: string) {
    // nothing to do here for now
    return path;
  }

  protected toMinimatch(value: string): string {
    // currently, nothing to change.
    return value;
  }
}

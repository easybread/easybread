import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

export const SEGMENT_MACRO = enumSuiteObject(enumObject(['P', 'S']));
export type SegmentMacro = typeof SEGMENT_MACRO.$type;

type KeyPresetSegment<T extends SegmentMacro, P extends string> = {
  macro: T;
  propName: P;
};

type KeyPresetSegmentAny = KeyPresetSegment<SegmentMacro, string>;

type inferKeyPresetSegment<T extends string> =
  T extends `${infer Macro extends SegmentMacro}(${infer PropName extends string})`
    ? KeyPresetSegment<Macro, PropName>
    : never;

type inferKeyPresetSegments<T extends string> =
  T extends `${infer A}:${infer R}`
    ? [inferKeyPresetSegment<A>, ...inferKeyPresetSegments<R>]
    : [inferKeyPresetSegment<T>];

type inferKeyProps<T extends readonly KeyPresetSegmentAny[]> = T extends [
  infer S extends KeyPresetSegmentAny,
  ...infer R extends readonly KeyPresetSegmentAny[],
]
  ? {
      [K in S['propName']]: string;
    } & inferKeyProps<R>
  : Record<never, never>;

export function parseKeyDef<T extends string>(
  keyDef: T,
): inferKeyPresetSegments<T> {
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
  }) as inferKeyPresetSegments<T>;
}

const test1 = parseKeyDef('S(execId):P(nodeId):P(key)');
const test2 = parseKeyDef('P(nodeId)');

// class KeyFactory<U extends KeySegmentAny, T extends readonly U[]> {
//   static fromKeyPreset<T extends string>(keyPreset: T) {
//     return new KeyFactory(parseKeyDef(keyPreset));
//   }

//   protected readonly segments: T;

//   constructor(segments: T) {
//     this.segments = segments;
//   }

//   fromOptions(options: inferKeyOptions<T>) {
//     return options;
//   }
// }

// const fKeyFactory = KeyFactory.fromKeyPreset('S(execId):P(nodeId):P(key)');
// const key = fKeyFactory.fromOptions({
//   execId: 'ex1',
//   nodeId: 'r/enum',
//   key: '-/1',
// });

class Key<T extends readonly KeyPresetSegmentAny[]> {
  protected readonly presetSegments: T;
  protected readonly keyProps: inferKeyProps<T>;

  constructor(segments: T, options: inferKeyProps<T>) {
    this.presetSegments = segments;
    this.keyProps = options;
  }
}

class FKey extends Key<inferKeyPresetSegments<'S(execId):P(nodeId):P(key)'>> {}

FKey.fromProps({ execId: 'ex1', key: '-/1', nodeId: 'r/enum' });

const key = Key.fromOptions({
  execId: 'ex1',
  nodeId: 'r/enum',
  key: '-/1',
});

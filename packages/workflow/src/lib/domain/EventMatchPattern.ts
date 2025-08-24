import { WORKFLOW_EVENT_NAME } from './WorkflowEvent';

export type EventMatchPatternWildcardChar =
  (typeof EventMatchPattern.WILDCARDS)[keyof typeof EventMatchPattern.WILDCARDS];

// TODO: move to shared utilities
type NoWidenAnyString = string & { readonly __nominal?: never };

export type Wildcardable<T extends string> = string extends T
  ? EventMatchPatternWildcardChar | NoWidenAnyString
  : EventMatchPatternWildcardChar | T;

export type EventMatchPatternOptions = {
  execId: string;
  eventName: Wildcardable<typeof WORKFLOW_EVENT_NAME.$type>;
  nodeId: Wildcardable<string>;
  fiberKey: Wildcardable<string>;
};

export class EventMatchPattern {
  static readonly WILDCARDS = {
    SQEUENCE: '*',
    ONE_CHAR: '?',
    ONE_SEGMENT: '~',
  } as const;

  static isWirdcard(char: string): char is EventMatchPatternWildcardChar {
    return Object.values(this.WILDCARDS).includes(char as any);
  }

  static make(options: EventMatchPatternOptions) {
    return new EventMatchPattern(options);
  }

  static makeFiberKeyOption(options: {
    prefixWildcard?: EventMatchPatternWildcardChar;
    keyPartial: string;
    suffixWildcard?: EventMatchPatternWildcardChar;
  }) {
    return [options.prefixWildcard, options.keyPartial, options.suffixWildcard]
      .filter(part => part != null)
      .join('/')
      .replace(/\/+/g, '/');
  }

  static fromString(pattern: string) {
    const [execId, eventName, nodeId, fiberKey] = pattern.split(':');

    if (!execId || !eventName || !nodeId || !fiberKey) {
      throw new Error('Invalid event match pattern');
    }

    if (
      !WORKFLOW_EVENT_NAME.hasValue(eventName) &&
      !EventMatchPattern.isWirdcard(eventName)
    ) {
      throw new Error(`Invalid event name ${eventName}`);
    }

    return new EventMatchPattern({
      execId,
      eventName,
      nodeId,
      fiberKey,
    });
  }

  private readonly options: EventMatchPatternOptions;

  private constructor(options: EventMatchPatternOptions) {
    this.options = options;
  }

  get execId() {
    return this.options.execId;
  }

  toString() {
    return [
      this.options.execId,
      this.options.eventName,
      this.options.nodeId,
      this.options.fiberKey,
    ].join(':');
  }
}

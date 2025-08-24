import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

import type { Fiber } from './domain/Fiber';
import type { IOConstraint } from './helpers/IO';
import type { Option } from './helpers/Option';

export const INTENT_TYPE = enumSuiteObject(
  enumObject(['CLOSE_FIBER', 'RUN_NODE', 'UPDATE_STATE', 'STOP_PROPAGATION']),
);

export type IntentType = typeof INTENT_TYPE.$type;

export abstract class Intent<T extends IntentType, P = undefined> {
  static hasStopPropagation(intents: IntentAny[]) {
    return intents.some(
      intent => intent.type === INTENT_TYPE.enum.STOP_PROPAGATION,
    );
  }

  static closeFiber<TClose extends IOConstraint>(
    options: CloseFiberIntentOptions<TClose>,
  ) {
    return new CloseFiberIntent(options);
  }

  static runNode(options: RunNodeIntentOptions) {
    return new RunNodeIntent(options);
  }

  static stopPropagation(options: StopPropagationIntentOptions) {
    return new StopPropagationIntent(options);
  }

  type: T;
  payload: P;

  protected constructor(type: T, payload: P) {
    this.type = type;
    this.payload = payload;
  }
}

interface CloseFiberIntentOptions<TClose extends IOConstraint> {
  fiber: Fiber;
  data: Option<TClose>;
}

export class CloseFiberIntent<TClose extends IOConstraint> extends Intent<
  typeof INTENT_TYPE.enum.CLOSE_FIBER,
  { fiber: Fiber; data: Option<TClose> }
> {
  constructor({ fiber, data }: CloseFiberIntentOptions<TClose>) {
    super(INTENT_TYPE.enum.CLOSE_FIBER, { fiber, data });
  }
}

interface RunNodeIntentOptions {
  nodeId: string;
  fiber: Fiber;
}

export class RunNodeIntent extends Intent<
  typeof INTENT_TYPE.enum.RUN_NODE,
  { nodeId: string; fiber: Fiber }
> {
  constructor({ nodeId, fiber }: RunNodeIntentOptions) {
    super(INTENT_TYPE.enum.RUN_NODE, { nodeId, fiber });
  }
}

interface StopPropagationIntentOptions {
  reason: string;
}

export class StopPropagationIntent extends Intent<
  typeof INTENT_TYPE.enum.STOP_PROPAGATION,
  { reason: string }
> {
  constructor({ reason }: StopPropagationIntentOptions) {
    super(INTENT_TYPE.enum.STOP_PROPAGATION, { reason });
  }
}

export type CloseFiberIntentAny = CloseFiberIntent<IOConstraint>;
export type IntentAny =
  | CloseFiberIntentAny
  | RunNodeIntent
  | StopPropagationIntent;

import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

import type { Fiber } from './domain/Fiber';
import type { IOConstraint } from './helpers/IO';
import type { Option } from './helpers/Option';

export const INTENT_TYPE = enumSuiteObject(
  enumObject(['CLOSE_FIBER', 'RUN_NODE', 'UPDATE_STATE', 'STOP_PROPAGATION']),
);

export type IntentType = typeof INTENT_TYPE.$type;

export interface IntentBase<T extends IntentType, P = undefined> {
  type: T;
  payload: P;
}

export type CloseFiberIntent<TClose extends IOConstraint> = IntentBase<
  typeof INTENT_TYPE.enum.CLOSE_FIBER,
  { fiber: Fiber; close: Option<TClose> }
>;

export type StateOp = 'SET' | 'APPEND_ITEM' | 'REMOVE_ITEM';
export type StateUpdateIntent = IntentBase<
  typeof INTENT_TYPE.enum.UPDATE_STATE,
  StateOp[]
>;

export type RunNodeIntent = IntentBase<
  typeof INTENT_TYPE.enum.RUN_NODE,
  { nodeId: string }
>;

export type StopPropagationIntent = IntentBase<
  typeof INTENT_TYPE.enum.STOP_PROPAGATION
>;

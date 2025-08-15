import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

export const INTENT_TYPE = enumSuiteObject(
  enumObject(['CLOSE_FIBER', 'RUN_NODE', 'UPDATE_STATE', 'STOP_PROPAGATION']),
);

export type IntentType = typeof INTENT_TYPE.$type;

export interface IntentBase<T extends IntentType, P = undefined> {
  type: T;
  payload: P;
}

export type CloseFiberIntent = IntentBase<typeof INTENT_TYPE.enum.CLOSE_FIBER>;

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

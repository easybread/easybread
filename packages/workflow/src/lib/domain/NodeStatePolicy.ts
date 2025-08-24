import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

import type { IOConstraint } from '../helpers/IO';
import type { Option, Some } from '../helpers/Option';

export const NODE_STATE_POLICY_TYPE = enumSuiteObject(
  enumObject(['NONE', 'SCOPED']),
);

export type NodeStatePolicyNone = {
  type: typeof NODE_STATE_POLICY_TYPE.enum.NONE;
};

export function noneStatePolicy(): NodeStatePolicyNone {
  return { type: NODE_STATE_POLICY_TYPE.enum.NONE };
}

export type NodeStatePolicyScoped<D extends IOConstraint> = {
  type: typeof NODE_STATE_POLICY_TYPE.enum.SCOPED;
  init: (previousState: Option<D>) => Some<D>;
};

export function scopedStatePolicy<D extends IOConstraint>(
  init: (previousState: Option<D>) => Some<D>,
): NodeStatePolicyScoped<D> {
  return { type: NODE_STATE_POLICY_TYPE.enum.SCOPED, init };
}

export type NodeStatePolicy =
  | NodeStatePolicyNone
  | NodeStatePolicyScoped<IOConstraint>;

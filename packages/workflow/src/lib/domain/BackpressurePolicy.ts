import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

export const BACKPRESSURE_POLICY_TYPE = enumSuiteObject(
  enumObject(['NONE', 'GLOBAL', 'NEAREST_FORK']),
);

export type BackpressurePolicyType =
  (typeof BACKPRESSURE_POLICY_TYPE.enum)[keyof typeof BACKPRESSURE_POLICY_TYPE.enum];

export type NearsetForkBackpressurePolicy = {
  type: typeof BACKPRESSURE_POLICY_TYPE.enum.NEAREST_FORK;
  threshold: number;
};

export type NoneBackpressurePolicy = {
  type: typeof BACKPRESSURE_POLICY_TYPE.enum.NONE;
};

export type GlobalBackpressurePolicy = {
  type: typeof BACKPRESSURE_POLICY_TYPE.enum.GLOBAL;
  threshold: number;
};

const DEFAULT_THRESHOLD = 50;

export function globalBackpressurePolicy(
  threshold = DEFAULT_THRESHOLD,
): GlobalBackpressurePolicy {
  return { type: BACKPRESSURE_POLICY_TYPE.enum.GLOBAL, threshold };
}

export function noneBackpressurePolicy(): NoneBackpressurePolicy {
  return { type: BACKPRESSURE_POLICY_TYPE.enum.NONE };
}

export function nearestForkBackpressurePolicy(
  threshold = DEFAULT_THRESHOLD,
): NearsetForkBackpressurePolicy {
  return { type: BACKPRESSURE_POLICY_TYPE.enum.NEAREST_FORK, threshold };
}

export type BackpressurePolicy =
  | NearsetForkBackpressurePolicy
  | NoneBackpressurePolicy
  | GlobalBackpressurePolicy;

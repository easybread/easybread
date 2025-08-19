import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

export const FIBER_POLICY_TYPE = enumSuiteObject(
  enumObject(['FORK', 'JOIN', 'PIPE']),
);

export type FiberPolicyType = typeof FIBER_POLICY_TYPE.$type;

export type ForkFiberPolicy = {
  type: typeof FIBER_POLICY_TYPE.enum.FORK;
  forkCount: number | null;
};

export type JoinFiberPolicy = {
  type: typeof FIBER_POLICY_TYPE.enum.JOIN;
  // forking nodeId to join forks from
  anchor: string;
  limit: number | null;
};

export type PipeFiberPolicy = {
  type: typeof FIBER_POLICY_TYPE.enum.PIPE;
};

export type FiberPolicy = ForkFiberPolicy | JoinFiberPolicy | PipeFiberPolicy;

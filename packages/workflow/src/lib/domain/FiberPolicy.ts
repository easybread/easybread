import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

export const FIBER_POLICY_TYPE = enumSuiteObject(
  enumObject(['FORK', 'JOIN', 'PIPE']),
);

export type FiberPolicyType = typeof FIBER_POLICY_TYPE.$type;

export type ForkFiberPolicy = {
  type: typeof FIBER_POLICY_TYPE.enum.FORK;
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

export function makeJoinFiberPolicy(
  anchor: string,
  limit: number,
): JoinFiberPolicy {
  return {
    type: FIBER_POLICY_TYPE.enum.JOIN,
    anchor,
    limit,
  };
}
export function makeForkFiberPolicy(): ForkFiberPolicy {
  return {
    type: FIBER_POLICY_TYPE.enum.FORK,
  };
}

export function makePipeFiberPolicy(): PipeFiberPolicy {
  return {
    type: FIBER_POLICY_TYPE.enum.PIPE,
  };
}

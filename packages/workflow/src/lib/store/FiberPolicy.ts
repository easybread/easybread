import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

export const FIBER_POLICY_TYPE = enumSuiteObject(
  enumObject(['WORKFLOW_FORK', 'FIBER_FORK', 'FIBER_JOIN', 'PIPE']),
);

export type FiberPolicyType = typeof FIBER_POLICY_TYPE.$type;

export type WorkflowForkPolicy = {
  type: typeof FIBER_POLICY_TYPE.enum.WORKFLOW_FORK;
  forkCount: number;
};

export type FiberForkPolicy = {
  type: typeof FIBER_POLICY_TYPE.enum.FIBER_FORK;
};

export type FiberJoinPolicy = {
  type: typeof FIBER_POLICY_TYPE.enum.FIBER_JOIN;
  // forking nodeId to join forks from
  anchor: string;
  limit: number | null;
};

export type PipePolicy = {
  type: typeof FIBER_POLICY_TYPE.enum.PIPE;
};

export type FiberPolicy =
  | WorkflowForkPolicy
  | FiberForkPolicy
  | FiberJoinPolicy
  | PipePolicy;

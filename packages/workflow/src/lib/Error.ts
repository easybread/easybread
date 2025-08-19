import { BreadException } from '@easybread/core';

export abstract class WorkflowError<
  T extends string,
  D = unknown,
  C = unknown,
> extends BreadException<T> {
  readonly details: D;

  constructor(message: string, details: D, cause?: C) {
    super(message, cause ? { cause } : undefined);
    this.details = details;
  }

  override toObject() {
    return {
      ...super.toObject(),
      details: this.details,
    };
  }
}

export class WorkflowExecutionError<
  T extends string,
  D = unknown,
  C = unknown,
> extends WorkflowError<T, D, C> {
  constructor(workflowId: string, message: string, details: D, cause?: C) {
    super(`Workflow ${workflowId} failed: ${message}`, details, cause);
  }
}

export class InvalidFiberKeyError extends WorkflowError<
  'InvalidFiberKeyError',
  { execId: string; key: string }
> {
  constructor(execId: string, key: string) {
    super(`Invalid fiber key: ${execId}:${key}`, { execId, key });
  }
}

export class CASVersionMismatchError extends WorkflowError<
  'CASVersionMismatchError',
  { key: string; expectedVersion: number; actualVersion: number }
> {
  constructor(key: string, expectedVersion: number, actualVersion: number) {
    super(
      `Version mismatch for key ${key}: expected ${expectedVersion}, got ${actualVersion}`,
      { key, expectedVersion, actualVersion },
    );
  }
}

export class CASMaxRetriesReachedError extends WorkflowError<
  'CASMaxRetriesReachedError',
  {
    key: string;
    expectedVersion: number;
    actualVersion: number;
    retries: number;
  }
> {
  constructor(
    key: string,
    expectedVersion: number,
    actualVersion: number,
    retries: number,
  ) {
    super(
      `CAS max retries reached for key ${key}: expected ${expectedVersion}, got ${actualVersion}`,
      { key, expectedVersion, actualVersion, retries },
    );
  }
}

export class UnknownFiberPolicyError extends WorkflowError<
  'UnknownFiberPolicyError',
  { policy: unknown }
> {
  constructor(policy: unknown) {
    super(`Unknown fiber policy`, { policy });
  }
}

export class FiberNotClosedError extends WorkflowError<
  'FiberNotClosedError',
  { fiberKey: string; execId: string }
> {
  constructor(execId: string, fiberKey: string) {
    super(`Fiber ${execId}:${fiberKey} is not closed`, { execId, fiberKey });
  }
}

export class FiberAlreadyClosedError extends WorkflowError<
  'FiberAlreadyClosedError',
  { fiberKey: string; execId: string }
> {
  constructor(execId: string, fiberKey: string) {
    super(`Fiber ${execId}:${fiberKey} is already closed`, {
      execId,
      fiberKey,
    });
  }
}
export type WorkflowErrorAny = WorkflowError<any, any, any>;

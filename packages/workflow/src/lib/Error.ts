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

export class WorkflowStepExecutionError<
  T extends string,
  D = unknown,
  C = unknown,
> extends WorkflowError<T, D, C> {
  constructor(stepId: string, message: string, details: D, cause?: C) {
    super(`Step exception ${stepId} failed: ${message}`, details, cause);
  }
}

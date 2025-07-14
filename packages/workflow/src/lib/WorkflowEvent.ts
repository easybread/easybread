import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

import { BreadEvent } from '@easybread/core';

import type { ExecutableAny } from './Executable';
import type { IOOut } from './IO';

export const WORKFLOW_EVENT_NAME = enumSuiteObject(
  enumObject(['DATA', 'STARTED']),
);

export abstract class WorkflowEvent<T> extends BreadEvent<T> {
  abstract readonly name: typeof WORKFLOW_EVENT_NAME.$type;
  readonly executablePath: string[] = [];

  recordPath(executable: ExecutableAny) {
    this.executablePath.unshift(executable._id);
  }
}

export class ExecutableDataEvent<T extends ExecutableAny> extends WorkflowEvent<
  IOOut<T>
> {
  readonly name = WORKFLOW_EVENT_NAME.enum.DATA;
}

export class ExecutableStartedEvent extends WorkflowEvent<never> {
  readonly name = WORKFLOW_EVENT_NAME.enum.STARTED;
}

export type WorkflowEventAny =
  | ExecutableStartedEvent
  | ExecutableDataEvent<any>;

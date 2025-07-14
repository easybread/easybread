import type { BreadEventBus } from '@easybread/core';

import { type IOAny, type IOIn, type IOOut, type WithIO } from './IO';
import type { WorkflowEventAny } from './WorkflowEvent';

export interface Executable<T extends IOAny>
  extends WithIO<T>,
    BreadEventBus<WorkflowEventAny> {
  readonly _id: string;
  execute(input: IOIn<this>): Promise<IOOut<this>>;
}

export type ExecutableAny = Executable<IOAny>;

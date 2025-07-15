import type { IOIn, IOOut } from './IO';
import type { WorkflowAny } from './workflow';

type WorkflowState = any;
interface WorflowRunner<T extends WorkflowAny> {
  _workflow: T;
  _state: WorkflowState;
  run(input: IOIn<T>): IOOut<T>;
}

export class WorkflowRunnerLocal<T extends WorkflowAny>
  implements WorflowRunner<T>
{
  _workflow: T;
  _state: WorkflowState;

  static make = <T extends WorkflowAny>(w: T) => new this(w);
  static load = <T extends WorkflowAny>(w: T, state: WorkflowState) =>
    new this(w, state);

  protected constructor(workflow: T, state?: WorkflowState) {
    this._workflow = workflow;
    this._state = state ?? {};
  }

  async run(input: IOIn<T>): Promise<Awaited<IOOut<T>>> {
    return await this._workflow.execute(input);
  }
}

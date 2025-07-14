import { BreadEventBus } from '@easybread/core';
import type {
  BreadDataMapDefinition,
  BreadDataMapIOConstraint,
} from '@easybread/data-mapper';

import type { Executable, ExecutableAny } from './Executable';
import { type IO, type IOIn, type IOOut } from './IO';
import { Step } from './Step';
import type { WorkflowEventAny } from './WorkflowEvent';

type WorkflowAny = Workflow<any, any>;

export class Workflow<
    TFirst extends ExecutableAny | never = never,
    TLast extends ExecutableAny | never = TFirst,
  >
  extends BreadEventBus<WorkflowEventAny>
  implements Executable<IO<TFirst, TLast>>
{
  readonly _io = {} as IO<
    TFirst extends ExecutableAny ? IOIn<TFirst> : never,
    TLast extends ExecutableAny ? IOOut<TLast> : never
  >;

  readonly _id: string;
  readonly _steps: Map<string, ExecutableAny> = new Map();
  readonly _seq: string[] = [];

  static startAt<TStart extends ExecutableAny>(
    start: TStart,
  ): Workflow<TStart, TStart> {
    return new Workflow([start]);
  }

  static Generator<TGen extends ExecutableAny>(): Workflow<TGen, TGen> {
    return {} as any;
  }

  static Parallel<
    T extends ExecutableAny[],
  >(items: T): Workflow<T[], T[number]> {
    return new Workflow(items);
  }

  protected constructor(sequence: ExecutableAny[] = []) {
    super();
    this._id = crypto.randomUUID();

    for (const item of sequence) {
      this._seq.push(item._id);
      this._steps.set(item._id, item);
    }
  }

  async execute(input: IOIn<TFirst>): Promise<IOOut<TLast>> {
    const items = this.getItemsSequence();
    let result = input;
    for (const item of items) {
      result = await item.execute(result);
    }
    return result;
  }

  getNext(previousId: string | null): ExecutableAny | null {
    const nextId = this.getNextId(previousId);
    return nextId ? this.getById(nextId) : null;
  }

  andThen<TNext extends Executable<IO<IOOut<this>, any>>>(
    next: TNext,
  ): Workflow<TFirst, TNext>;

  andThen<TNext extends ExecutableAny>(
    next: TNext,
    mapperDefinition: BreadDataMapDefinition<IOOut<this>, IOIn<TNext>>,
  ): Workflow<TFirst, TNext>;

  andThen<TNext extends ExecutableAny>(
    next: TNext,
    mapDefinition?: BreadDataMapDefinition<IOOut<this>, IOIn<TNext>>,
  ): Workflow<TFirst, TNext> {
    const sequence = this.getItemsSequence();
    const mappingWorkflow = new Workflow([this, next]);

    if (mapDefinition) {
      sequence.push(Step.DataMapper(next._id, mapDefinition));
    }

    sequence.push(next);

    return new Workflow(sequence);
  }

  private getItemsSequence() {
    return this._seq.map(id => this._steps.get(id) as ExecutableAny);
  }

  private getNextId(previousId: string | null): string | null {
    const index = previousId ? this._seq.indexOf(previousId) : -1;
    return this._seq[index + 1] ?? null;
  }

  private getById(id: string): ExecutableAny | null {
    return this._steps.get(id) ?? null;
  }
}

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

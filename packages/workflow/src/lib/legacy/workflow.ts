import type { NonEmptyArray } from '@space-architects/util-ts';

import { BreadEventBus } from '@easybread/core';
import type {
  BreadDataMapDefinition,
  BreadDataMapIOConstraint,
} from '@easybread/data-mapper';

import type { WorkflowEventAny } from '../WorkflowEvent';
import { type IO, type IOIn, type IOOut } from '../helpers/IO';

import type { Executable, ExecutableAny } from './Executable';
import { Step } from './Step';

export type WorkflowAny = Workflow<any, any>;

// executes executables in sequence, passing output of one to the input of the next
type PipeWorkflow<
  TIn extends BreadDataMapIOConstraint | never,
  TOut extends BreadDataMapIOConstraint | never,
> = Workflow<TIn, TOut>;

export class Workflow<
    TIn extends BreadDataMapIOConstraint | never,
    TOut extends BreadDataMapIOConstraint | never,
  >
  extends BreadEventBus<WorkflowEventAny>
  implements Executable<IO<TIn, TOut>>
{
  readonly _io = {} as IO<TIn, TOut>;
  readonly _id: string;
  readonly _map: Map<string, ExecutableAny> = new Map();
  readonly _seq: string[] = [];

  static startAt<TStart extends ExecutableAny>(
    start: TStart,
  ): Workflow<IOIn<TStart>, IOOut<TStart>> {
    return new Workflow([start]);
  }

  // static Parallel<T extends ExecutableAny[]>(
  //   ...items: T
  // ): Workflow<IOIn<T[number]>, [...T]> {
  //   return new Workflow(items);
  // }

  protected constructor(sequence: ExecutableAny[]) {
    super();
    this._id = ``;

    for (const item of sequence) {
      this._seq.push(item._id);
      this._map.set(item._id, item);
    }
  }

  async execute(input: IOIn<this>): Promise<IOOut<this>> {
    const items = this.getItemsSequence();

    let result: IOOut<this> | null = null;

    for (const item of items) {
      result = await item.execute(result ?? input);
    }

    return result as IOOut<this>;
  }

  getNext(previousId: string | null): ExecutableAny | null {
    const nextId = this.getNextId(previousId);
    return nextId ? this.getById(nextId) : null;
  }

  pipe<TNext extends Executable<IO<IOOut<this>, any>>>(
    next: TNext,
  ): Workflow<IOOut<this>, IOOut<TNext>>;

  pipe<TNext extends ExecutableAny>(
    next: TNext,
    mapperDefinition: BreadDataMapDefinition<IOOut<this>, IOIn<TNext>>,
  ): Workflow<IOOut<this>, IOOut<TNext>>;

  pipe<TNext extends ExecutableAny>(
    next: TNext,
    mapDefinition?: BreadDataMapDefinition<IOOut<this>, IOIn<TNext>>,
  ): Workflow<IOOut<this>, IOIn<TNext>> {
    const sequence = this.getItemsSequence();

    const last = this.getLastItem();

    if (mapDefinition) {
      const mappingWorkflow = new Workflow([
        Step.DataMapper(`${last._id}->${next._id}`, mapDefinition),
        next,
      ]);
      sequence.push(mappingWorkflow);
    }

    sequence.push(next);

    return new Workflow(sequence);
  }

  private getItemsSequence() {
    return this._seq.map(id =>
      this._map.get(id),
    ) as NonEmptyArray<ExecutableAny>;
  }

  private getNextId(previousId: string | null): string | null {
    const index = previousId ? this._seq.indexOf(previousId) : -1;
    return this._seq[index + 1] ?? null;
  }

  private getById(id: string): ExecutableAny | null {
    return this._map.get(id) ?? null;
  }

  private getLastItem(): ExecutableAny {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.getById(this.getLastItemId())!;
  }

  private getLastItemId(): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._seq[this._seq.length - 1]!;
  }
}

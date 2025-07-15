import { BreadEventBus } from '@easybread/core';
import type {
  BreadDataMapDefinition,
  BreadDataMapIOConstraint,
} from '@easybread/data-mapper';

import type { Executable, ExecutableAny } from './Executable';
import { type IO, type IOIn, type IOOut } from './IO';
import { Step } from './Step';
import type { WorkflowEventAny } from './WorkflowEvent';

export type WorkflowAny = Workflow<any, any>;

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

  protected constructor(sequence = [ExecutableAny, ...ExecutableAny[]]) {
    super();
    this._id = crypto.randomUUID();

    for (const item of sequence) {
      this._seq.push(item._id);
      this._map.set(item._id, item);
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

    const last = sequence[sequence.length - 1]!;

    if (mapDefinition) {
      const mappingWorkflow = new Workflow([
        Step.DataMapper(next._id, mapDefinition),
        next,
      ]);
      sequence.push(mappingWorkflow);
    }

    sequence.push(next);

    return new Workflow(sequence);
  }

  private getItemsSequence() {
    return this._seq.map(id => this._map.get(id) as ExecutableAny);
  }

  private getNextId(previousId: string | null): string | null {
    const index = previousId ? this._seq.indexOf(previousId) : -1;
    return this._seq[index + 1] ?? null;
  }

  private getById(id: string): ExecutableAny | null {
    return this._map.get(id) ?? null;
  }
}

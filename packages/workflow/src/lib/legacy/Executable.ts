import { type IOAny, type IOIn, type IOOut } from '../helpers/IO';

export interface Executable extends IOAny {
  readonly _id: string;
  execute(input: IOIn<this>): Promise<IOOut<this>>;
}

export type ExecutableAny = Executable<IOAny>;

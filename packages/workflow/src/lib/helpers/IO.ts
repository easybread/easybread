export const _IO = Symbol('io');

export type IOConstraint = Record<string, unknown>;

export type IO<I extends IOConstraint, O extends IOConstraint> = {
  readonly input: I;
  readonly output: O;
};

export type IOAny = IO<IOConstraint, IOConstraint>;

export abstract class WithIO<IO extends IOAny = IOAny> {
  readonly [_IO] = {} as IO;
}

export type WithIOAny = WithIO<IOAny>;
export type GetIO<T extends WithIOAny> = T[typeof _IO];

export type IOOut<T extends IOAny> = T['output'];
export type IOIn<T extends IOAny> = T['input'];

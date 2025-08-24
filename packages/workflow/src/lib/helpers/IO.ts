export const _IO = Symbol('io');

type _IOConstraintItem = Record<string, unknown> | null;
export type IOConstraint = _IOConstraintItem | _IOConstraintItem[];

export type IO<I extends IOConstraint, O extends IOConstraint> = {
  readonly input: I;
  readonly output: O;
};

export type IOAny = IO<IOConstraint, IOConstraint>;
export type IOOut<T extends IOAny> = T['output'];
export type IOIn<T extends IOAny> = T['input'];

export abstract class WithIO<IO extends IOAny = IOAny> {
  readonly [_IO] = {} as IO;

  /**
   * Type system testing helper method
   */
  __checkIO(_input: IOIn<IO>): IOOut<IO> {
    console.log('__checkIO', { _input });
    return {} as IOOut<IO>;
  }
}

export type WithIOAny = WithIO<IOAny>;
export type GetIO<T extends WithIOAny> = T[typeof _IO];
export type GetIOOutput<T extends WithIOAny> = GetIO<T>['output'];
export type GetIOInput<T extends WithIOAny> = GetIO<T>['input'];

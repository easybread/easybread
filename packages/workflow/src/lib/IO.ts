/* eslint-disable @typescript-eslint/no-explicit-any */

export type IO<I, O> = {
  input: I;
  output: O;
};

export type IOAny = IO<any, any>;

export type WithIO<T extends IOAny = IOAny> = {
  _io: T;
};

export type IOOut<T extends WithIO> = T['_io']['output'];
export type IOIn<T extends WithIO> = T['_io']['input'];

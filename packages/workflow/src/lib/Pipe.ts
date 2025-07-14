/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IO_Out } from './IO';
import type { IO_In } from './IO';
import type { Step, StepAny } from './Step';

interface PipeFn {
  <A extends StepAny>(a: A): IO_Out<A>;
  <A extends StepAny, B extends Step<any, IO_Out<A>, any>>(
    a: A,
    b: B,
  ): (input: IO_In<A>) => IO_Out<B>;
  <
    A extends StepAny,
    B extends Step<any, IO_Out<A>, any>,
    C extends Step<any, IO_Out<B>, any>,
  >(
    a: A,
    b: B,
    c: C,
  ): (input: IO_In<A>) => IO_Out<C>;
  <
    A extends StepAny,
    B extends Step<any, IO_Out<A>, any>,
    C extends Step<any, IO_Out<B>, any>,
    D extends Step<any, IO_Out<C>, any>,
  >(
    a: A,
    b: B,
    c: C,
    d: D,
  ): (input: IO_In<A>) => IO_Out<D>;
  <
    A extends StepAny,
    B extends Step<any, IO_Out<A>, any>,
    C extends Step<any, IO_Out<B>, any>,
    D extends Step<any, IO_Out<C>, any>,
    E extends Step<any, IO_Out<D>, any>,
  >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
  ): (input: IO_In<A>) => IO_Out<E>;
  <
    A extends StepAny,
    B extends Step<any, IO_Out<A>, any>,
    C extends Step<any, IO_Out<B>, any>,
    D extends Step<any, IO_Out<C>, any>,
    E extends Step<any, IO_Out<D>, any>,
    F extends Step<any, IO_Out<E>, any>,
  >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
  ): (input: IO_In<A>) => IO_Out<F>;
  <
    A extends StepAny,
    B extends Step<any, IO_Out<A>, any>,
    C extends Step<any, IO_Out<B>, any>,
    D extends Step<any, IO_Out<C>, any>,
    E extends Step<any, IO_Out<D>, any>,
    F extends Step<any, IO_Out<E>, any>,
    G extends Step<any, IO_Out<F>, any>,
  >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
  ): (input: IO_In<A>) => IO_Out<G>;
  <
    A extends StepAny,
    B extends Step<any, IO_Out<A>, any>,
    C extends Step<any, IO_Out<B>, any>,
    D extends Step<any, IO_Out<C>, any>,
    E extends Step<any, IO_Out<D>, any>,
    F extends Step<any, IO_Out<E>, any>,
    G extends Step<any, IO_Out<F>, any>,
    H extends Step<any, IO_Out<G>, any>,
  >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
  ): (input: IO_In<A>) => IO_Out<H>;
  <
    A extends StepAny,
    B extends Step<any, IO_Out<A>, any>,
    C extends Step<any, IO_Out<B>, any>,
    D extends Step<any, IO_Out<C>, any>,
    E extends Step<any, IO_Out<D>, any>,
    F extends Step<any, IO_Out<E>, any>,
    G extends Step<any, IO_Out<F>, any>,
    H extends Step<any, IO_Out<G>, any>,
    I extends Step<any, IO_Out<H>, any>,
  >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
  ): (input: IO_In<A>) => IO_Out<I>;
}

export const pipe: PipeFn = (...steps: StepAny[]) => {
  return async (input: IO_In<StepAny>) => {
    let r: IO_Out<StepAny>;
    for (const step of steps) {
      r = await step.execute(r);
    }
    return r;
  };
};

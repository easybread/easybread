import {
  type IO,
  type IOAny,
  type IOIn,
  type IOOut,
  type WithIO,
} from '../helpers/IO';

type Tag<T extends string> = { readonly _tag: T };

export function tagged<T extends string, V>(
  tag: T,
  value: V = {} as V,
): V & Tag<T> {
  return value as V & Tag<T>;
}

interface Node<IO extends IOAny = IOAny> extends WithIO<IO> {
  run(input: IOIn<this>): IOOut<this>;
}

export function makeNode<A, B>(a: A, b: B): Node<IO<A, B>> {
  return {
    _io: { input: a, output: b },
    run: (input: A): B => b,
  };
}

interface PipeFnReturn<IO extends IOAny> extends WithIO<IO> {
  run(input: IOIn<this>): IOOut<this>;
}

interface PipeFn {
  <N1 extends Node>(n1: N1): PipeFnReturn<IO<IOIn<N1>, IOOut<N1>>>;
  <N1 extends WithIO, N2 extends WithIO<IO<IOOut<N1>, any>>>(
    n1: N1,
    n2: N2,
  ): PipeFnReturn<IO<IOIn<N1>, IOOut<N2>>>;
  <
    N1 extends WithIO,
    N2 extends WithIO<IO<IOOut<N1>, any>>,
    N3 extends WithIO<IO<IOOut<N2>, any>>,
  >(
    n1: N1,
    n2: N2,
    n3: N3,
  ): PipeFnReturn<IO<IOIn<N1>, IOOut<N3>>>;
  <
    N1 extends WithIO,
    N2 extends WithIO<IO<IOOut<N1>, any>>,
    N3 extends WithIO<IO<IOOut<N2>, any>>,
    N4 extends WithIO<IO<IOOut<N3>, any>>,
  >(
    n1: N1,
    n2: N2,
    n3: N3,
    n4: N4,
  ): PipeFnReturn<IO<IOIn<N1>, IOOut<N4>>>;
  <
    N1 extends WithIO,
    N2 extends WithIO<IO<IOOut<N1>, any>>,
    N3 extends WithIO<IO<IOOut<N2>, any>>,
    N4 extends WithIO<IO<IOOut<N3>, any>>,
    N5 extends WithIO<IO<IOOut<N4>, any>>,
  >(
    n1: N1,
    n2: N2,
    n3: N3,
    n4: N4,
    n5: N5,
  ): PipeFnReturn<IO<IOIn<N1>, IOOut<N5>>>;
  <
    N1 extends WithIO,
    N2 extends WithIO<IO<IOOut<N1>, any>>,
    N3 extends WithIO<IO<IOOut<N2>, any>>,
    N4 extends WithIO<IO<IOOut<N3>, any>>,
    N5 extends WithIO<IO<IOOut<N4>, any>>,
    N6 extends WithIO<IO<IOOut<N5>, any>>,
  >(
    n1: N1,
    n2: N2,
    n3: N3,
    n4: N4,
    n5: N5,
    n6: N6,
  ): PipeFnReturn<IO<IOIn<N1>, IOOut<N6>>>;
}

const pipe: PipeFn = <T extends WithIO[]>(...nodes: T) => {
  return {} as any;
};

const a = tagged('a');
const b = tagged('b');
const c = tagged('c');
const d = tagged('d');
const e = tagged('e');
const f = tagged('f');
const g = tagged('g');
const h = tagged('h');

const nodeAB = makeNode(a, b);
const nodeBC = makeNode(b, c);
const nodeCD = makeNode(c, d);
const nodeDE = makeNode(d, e);
const nodeEF = makeNode(e, f);
const nodeFG = makeNode(f, g);
const nodeGH = makeNode(g, h);

const p1 = pipe(nodeAB, nodeBC);

// Alternative approach: create a MappedNode type
interface MappedNode<From, To, N extends Node<IO<To, any>>>
  extends Node<IO<From, IOOut<N>>> {
  mapFn: (input: From) => To;
  node: N;
}

export function mappedNode<From, To, N extends Node<IO<To, any>>>(
  node: N,
  mapFn: (input: From) => To,
): MappedNode<From, To, N> {
  return {
    _io: {
      input: {} as From,
      output: node._io.output,
    },
    mapFn,
    node,
    run: (input: From) => node.run(mapFn(input)),
  };
}

export function withMap<N extends Node, F>(n: N, map: (i: F) => IOIn<N>) {
  return mappedNode(n, map);
}

// export function withMap<To, Out>(node: NoInfer<Node<IO<To, Out>>>) {
//   return <From>(mapFn: (input: NoInfer<From>) => To): Node<IO<From, Out>> => {
//     return createMappedNode(node, mapFn);
//   };
// }

const p2 = pipe(
  nodeAB,
  withMap(nodeCD, (input: typeof b) => {
    // input is now properly typed as Tag<'b'> (output of nodeAB)
    console.log(input._tag); // input._tag is 'b'
    return c; // Need to return Tag<'c'> to match nodeCD's input
  }),
);

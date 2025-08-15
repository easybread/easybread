import { describe, expect, it } from 'vitest';

import { type IO, type IOOut, type WithIO } from '../IO';

describe('pipe type inference', () => {
  it('should demonstrate type inference with withMap', () => {
    // The core issue: TypeScript can't infer the input type in a curried function
    // when used within pipe because the type parameter is not in a position
    // that aids inference.

    // Here's a simplified example showing the problem:
    type Tag<T extends string> = { readonly _tag: T };

    const tagA: Tag<'a'> = { _tag: 'a' };
    const tagB: Tag<'b'> = { _tag: 'b' };
    const tagC: Tag<'c'> = { _tag: 'c' };

    interface Node<I, O> extends WithIO<IO<I, O>> {
      run(input: I): O;
    }

    function makeNode<I, O>(input: I, output: O): Node<I, O> {
      return {
        _io: { input, output },
        run: () => output,
      };
    }

    const nodeAB = makeNode(tagA, tagB);
    const nodeCD = makeNode(tagC, tagC);

    // The problematic pattern - curried function loses type context:
    function withMapProblem<I, O>(node: Node<I, O>) {
      return <From>(mapFn: (input: From) => I): Node<From, O> => {
        return {
          _io: { input: {} as From, output: node._io.output },
          run: (input: From) => node.run(mapFn(input)),
        };
      };
    }

    // Solution 1: Use a single function with all type parameters
    function mapBetween<From, To, Out>(
      mapFn: (input: From) => To,
      node: Node<To, Out>,
    ): Node<From, Out> {
      return {
        _io: { input: {} as From, output: node._io.output },
        run: (input: From) => node.run(mapFn(input)),
      };
    }

    // Solution 2: Helper type to extract output type from previous node
    type ExtractOutput<T> = T extends WithIO<IO<any, infer O>> ? O : never;

    // Solution 3: Modified pipe that helps with inference
    function pipeBetter<N1 extends WithIO>(n1: N1): N1;
    function pipeBetter<
      N1 extends WithIO,
      N2 extends WithIO<IO<ExtractOutput<N1>, any>>,
    >(n1: N1, n2: N2): WithIO<IO<IOOut<N1>['input'], IOOut<N2>['output']>>;
    function pipeBetter(...nodes: any[]): any {
      return nodes[nodes.length - 1];
    }

    // Or with a helper that captures the previous output type:
    function fromPrevious<Prev extends WithIO, To, Out>(
      prev: Prev,
      mapFn: (input: ExtractOutput<Prev>) => To,
      node: Node<To, Out>,
    ): Node<ExtractOutput<Prev>, Out> {
      return mapBetween(mapFn, node);
    }

    // This gives us perfect type inference:
    const result2 = pipeBetter(
      nodeAB,
      fromPrevious(
        nodeAB,
        input => {
          // input is correctly typed as Tag<'b'>!
          console.log(input._tag); // TypeScript knows this is 'b'
          return tagC;
        },
        nodeCD,
      ),
    );

    expect(result2).toBeDefined();
  });
});

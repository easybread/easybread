import { ConcurrentNode } from './ConcurrentNode';
import { FunctionNode } from './FunctionNode';

const root = new ConcurrentNode('root', [
  new FunctionNode('a', (input: { foo: 'smth' }) => {
    return { a: input.foo };
  }),

  new FunctionNode('b', (input: { foo: 'smth' }) => {
    return { b: input.foo };
  }),
]);

const output = root.__checkIO({ foo: 'smth' });

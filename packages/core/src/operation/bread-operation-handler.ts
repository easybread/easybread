import { BreadAuthStrategy } from '../auth-strategy';
import { BreadOperation } from './bread-operation';
import { BreadOperationContext } from './bread-operation-context';

export interface BreadOperationHandler<
  T extends BreadOperation<string>,
  A extends BreadAuthStrategy<object>
> {
  name: T['name'];

  handle(
    input: T['input'],
    context: BreadOperationContext<T, A>
  ): Promise<Omit<T['output'], 'provider'>>;
}

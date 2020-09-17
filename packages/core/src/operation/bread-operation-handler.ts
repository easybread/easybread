import { BreadAuthStrategy } from '../auth-strategy';
import { BreadServiceAdapterOptions } from '../common-interfaces';
import { BreadOperation } from './bread-operation';
import { BreadOperationContext } from './bread-operation-context';

export interface BreadOperationHandler<
  TOperation extends BreadOperation<string>,
  TAuthStrategy extends BreadAuthStrategy<object>,
  TOptions extends BreadServiceAdapterOptions | null = null
> {
  name: TOperation['name'];

  handle(
    input: TOperation['input'],
    context: BreadOperationContext<TOperation, TAuthStrategy, TOptions>,
    options: TOptions
  ): Promise<Omit<TOperation['output'], 'provider'>>;
}

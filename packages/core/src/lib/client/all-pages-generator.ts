import { BreadCollectionOperation } from '../operation';
import type {
  BreadServiceAdapterAny,
  InferServiceAdapterOperation,
} from '../service-adapter';
import type { DistributedOmit } from '@easybread/common';

export type AllPagesGeneratorInvokeFn<
  TOperation extends BreadCollectionOperation<string, any>
> = (
  name: TOperation['name'],
  data: DistributedOmit<TOperation['input'], 'name'>
) => Promise<TOperation['output']>;

export class AllPagesGenerator<TServiceAdapter extends BreadServiceAdapterAny> {
  constructor(
    private readonly invoke: AllPagesGeneratorInvokeFn<
      InferServiceAdapterOperation<TServiceAdapter>
    >
  ) {}

  generate<TOperation extends BreadCollectionOperation<string, any>>(
    name: TOperation['name'],
    data: DistributedOmit<TOperation['input'], 'name'>
  ): AsyncGenerator<TOperation['output'], void, unknown> {
    switch (data.pagination.type) {
      case 'DISABLED':
        return this.disabledGenerator(name, data);

      case 'PREV_NEXT':
        return this.prevNextGenerator(name, data);

      case 'SKIP_COUNT':
        return this.skipCountGenerator(name, data);

      default:
        throw new Error(`Unknown pagination`, {
          cause: data.pagination satisfies never,
        });
    }
  }

  private async *skipCountGenerator<
    TOperation extends BreadCollectionOperation<string, 'SKIP_COUNT'>
  >(
    name: TOperation['name'],
    data: DistributedOmit<TOperation['input'], 'name'>
  ): AsyncGenerator<TOperation['output'], void, unknown> {
    const { count = 50, type } = data.pagination;

    let skip = data.pagination.skip || 0;

    while (true) {
      const result = await this.invoke(name, {
        ...data,
        pagination: { type, skip, count },
      });

      yield result;

      if (result.rawPayload)
        if (skip + count >= result.pagination.totalCount)
          // reached the end of the collection
          return;

      // increase page for the next invoke() call
      skip += count;
    }
  }

  private async *prevNextGenerator<
    TOperation extends BreadCollectionOperation<string, 'PREV_NEXT'>
  >(
    name: TOperation['name'],
    data: DistributedOmit<TOperation['input'], 'name'>
  ): AsyncGenerator<TOperation['output'], void, unknown> {
    let page = data.pagination.page;

    while (true) {
      const result = await this.invoke(name, {
        ...data,
        pagination: { type: 'PREV_NEXT', page },
      });

      yield result;

      const { next } = result.pagination;

      // reached the end of the collection
      if (!next) return;

      // set the next page token for the next invoke() call
      page = next;
    }
  }

  private async *disabledGenerator<
    TOperation extends BreadCollectionOperation<string, 'DISABLED'>
  >(
    name: TOperation['name'],
    data: DistributedOmit<TOperation['input'], 'name'>
  ): AsyncGenerator<TOperation['output'], void, unknown> {
    yield await this.invoke(name, {
      ...data,
      pagination: { type: 'DISABLED' },
    });
  }
}

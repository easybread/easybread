import {
  BreadCollectionOperation,
  BreadOperation,
  BreadOperationPaginationType
} from '../operation';

type InvokeFunction = <O extends BreadOperation<string>>(
  input: O['input']
) => Promise<O['output']>;

export class AllPagesGenerator {
  constructor(private readonly invoke: InvokeFunction) {}

  generate<
    TOperation extends BreadCollectionOperation<
      string,
      BreadOperationPaginationType
    >
  >(
    input: TOperation['input']
  ): AsyncGenerator<TOperation['output'], void, unknown> {
    switch (input.pagination.type) {
      case 'DISABLED':
        return this.disabledGenerator<
          Extract<
            TOperation,
            BreadCollectionOperation<TOperation['name'], 'DISABLED'>
          >
        >(
          // TODO: avoid this
          input as Extract<
            TOperation,
            BreadCollectionOperation<TOperation['name'], 'DISABLED'>
          >['input']
        );

      case 'SKIP_COUNT':
        // TODO: how to avoid such a complex type annotations?
        return this.skipCountGenerator<
          Extract<
            TOperation,
            BreadCollectionOperation<TOperation['name'], 'SKIP_COUNT'>
          >
        >(
          // TODO: avoid this
          input as Extract<
            TOperation,
            BreadCollectionOperation<TOperation['name'], 'SKIP_COUNT'>
          >['input']
        );

      case 'PREV_NEXT':
        return this.prevNextGenerator<
          Extract<
            TOperation,
            BreadCollectionOperation<TOperation['name'], 'PREV_NEXT'>
          >
        >(
          // TODO: avoid this
          input as Extract<
            TOperation,
            BreadCollectionOperation<TOperation['name'], 'PREV_NEXT'>
          >['input']
        );
    }
  }

  private async *skipCountGenerator<
    TOperation extends BreadCollectionOperation<string, 'SKIP_COUNT'>
  >(
    input: TOperation['input']
  ): AsyncGenerator<TOperation['output'], void, unknown> {
    const { count = 50, type } = input.pagination;
    let skip = input.pagination.skip || 0;

    while (true) {
      const result = await this.invoke<TOperation>({
        ...input,
        pagination: { type, skip, count }
      });

      yield result;

      // reached the end of the collection
      if (skip + count >= result.pagination.totalCount) return;

      // increase page for the next invoke() call
      skip += count;
    }
  }

  private async *prevNextGenerator<
    TOperation extends BreadCollectionOperation<string, 'PREV_NEXT'>
  >(
    input: TOperation['input']
  ): AsyncGenerator<TOperation['output'], void, unknown> {
    let page = input.pagination.page;

    while (true) {
      const result = await this.invoke<TOperation>({
        ...input,
        pagination: { type: 'PREV_NEXT', page }
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
    input: TOperation['input']
  ): AsyncGenerator<TOperation['output'], void, unknown> {
    yield await this.invoke<TOperation>({
      ...input,
      pagination: { type: 'PREV_NEXT' }
    });
  }
}

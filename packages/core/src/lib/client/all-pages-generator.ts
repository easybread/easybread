import {
  type CommandAny,
  type CommandPaginatedAny,
  type CommandPaginatedDisabledAny,
  type inferCommandInput,
  type inferCommandName,
  type inferCommandOutput,
} from '../command';
import type {
  ServiceAdapterAny,
  inferServiceAdapterCommand,
} from '../service-adapter';

export type AllPagesGeneratorInvokeFn<TCmd extends CommandAny> = (
  name: inferCommandName<TCmd>,
  input: inferCommandInput<TCmd>,
) => Promise<inferCommandOutput<TCmd>>;

export class AllPagesGenerator<TClient extends ServiceAdapterAny> {
  private readonly invoke: AllPagesGeneratorInvokeFn<
    inferServiceAdapterCommand<TClient>
  >;

  constructor(
    invoke: AllPagesGeneratorInvokeFn<inferServiceAdapterCommand<TClient>>,
  ) {
    this.invoke = invoke;
  }
  //
  // generate<TName extends inferServiceAdapterPaginatedCommandName<TAdapter>>(
  //   name: TName,
  //   input: inferServiceAdapterCommandInputByName<TAdapter, TName>,
  // ): AsyncGenerator<
  //   inferServiceAdapterCommandOutputByName<TAdapter, TName>,
  //   void,
  //   unknown
  // > {
  //   switch (input.pagination.type) {
  //     case 'DISABLED':
  //       this.invoke(name, input);
  //       return {} as any;
  //     // return this.disabledGenerator(name, data);
  //
  //     case 'PREV_NEXT':
  //       return {} as any;
  //     // return this.prevNextGenerator(name, data);
  //
  //     case 'SKIP_COUNT':
  //       return {} as any;
  //     // return this.skipCountGenerator(name, data);
  //
  //     default:
  //       return {} as any;
  //     // throw new Error(`Unknown pagination`, {
  //     //   cause: input.pagination satisfies never,
  //     // });
  //   }
  generate<TCmd extends CommandPaginatedAny>(
    name: inferCommandName<TCmd>,
    input: inferCommandInput<TCmd>,
  ): AsyncGenerator<inferCommandOutput<TCmd>, void, unknown> {
    switch (input.pagination.type) {
      case 'DISABLED':

      default:
        return this.invoke(name, input) as any;
    }
  }

  private async *disabledGenerator<TCmd extends CommandPaginatedDisabledAny>(
    name: inferCommandName<TCmd>,
    input: inferCommandInput<TCmd>,
  ): AsyncGenerator<inferCommandOutput<TCmd>, void, unknown> {
    yield await this.invoke(name, input);
  }

  // private async *skipCountGenerator<
  //   TOperation extends BreadCollectionOperation<string, 'SKIP_COUNT'>,
  // >(
  //   name: TOperation['name'],
  //   data: DistributedOmit<TOperation['input'], 'name'>,
  // ): AsyncGenerator<TOperation['output'], void, unknown> {
  //   const { count = 50, type } = data.pagination;
  //
  //   let skip = data.pagination.skip || 0;
  //
  //   while (true) {
  //     const result = await this.invoke(name, {
  //       ...data,
  //       pagination: { type, skip, count },
  //     });
  //
  //     yield result;
  //
  //     if (result.rawPayload)
  //       if (skip + count >= result.pagination.totalCount)
  //         // reached the end of the collection
  //         return;
  //
  //     // increase page for the next invoke() call
  //     skip += count;
  //   }
  // }
  //
  // private async *prevNextGenerator<
  //   TOperation extends BreadCollectionOperation<string, 'PREV_NEXT'>,
  // >(
  //   name: TOperation['name'],
  //   data: DistributedOmit<TOperation['input'], 'name'>,
  // ): AsyncGenerator<TOperation['output'], void, unknown> {
  //   let page = data.pagination.page;
  //
  //   while (true) {
  //     const result = await this.invoke(name, {
  //       ...data,
  //       pagination: { type: 'PREV_NEXT', page },
  //     });
  //
  //     yield result;
  //
  //     const { next } = result.pagination;
  //
  //     // reached the end of the collection
  //     if (!next) return;
  //
  //     // set the next page token for the next invoke() call
  //     page = next;
  //   }
  // }
  //
}

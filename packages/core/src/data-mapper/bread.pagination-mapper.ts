import {
  BreadOperationInputPagination,
  BreadOperationOutputPagination,
  BreadOperationPaginationType
} from '../operation';
import { BreadDataMapDefinition } from './bread.data-map-definition.interface';
import { BreadPropertiesResolver } from './bread.properties-resolver';

export abstract class BreadPaginationMapper<
  TRemoteParamsType extends object,
  TRemoteDataType extends object,
  TPaginationType extends BreadOperationPaginationType
> {
  protected abstract readonly toOutputPaginationMap: BreadDataMapDefinition<
    TRemoteDataType,
    BreadOperationOutputPagination<TPaginationType>
  >;

  protected abstract readonly toRemoteParamsMap: BreadDataMapDefinition<
    BreadOperationInputPagination<TPaginationType>,
    TRemoteParamsType
  >;

  public toOutputPagination(
    input: TRemoteDataType
  ): BreadOperationOutputPagination<TPaginationType> {
    const resolver = new BreadPropertiesResolver<
      TRemoteDataType,
      BreadOperationOutputPagination<TPaginationType>
    >(this.toOutputPaginationMap);

    return resolver.resolve(input);
  }

  public toRemoteParams(
    input: BreadOperationInputPagination<TPaginationType>
  ): TRemoteParamsType {
    const resolver = new BreadPropertiesResolver<
      BreadOperationInputPagination<TPaginationType>,
      TRemoteParamsType
    >(this.toRemoteParamsMap);

    return resolver.resolve(input);
  }
}

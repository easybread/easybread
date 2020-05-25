import {
  BreadCollectionOperationInputPagination,
  BreadCollectionOperationOutputPagination
} from '../operation';
import { BreadDataMapDefinition } from './bread.data-map-definition.interface';
import { BreadPropertiesResolver } from './bread.properties-resolver';

export abstract class BreadPaginationMapper<
  TRemoteParamsType extends object,
  TRemoteDataType extends object
> {
  protected abstract readonly toOutputPaginationMap: BreadDataMapDefinition<
    TRemoteDataType,
    BreadCollectionOperationOutputPagination
  >;

  protected abstract readonly toRemoteParamsMap: BreadDataMapDefinition<
    BreadCollectionOperationInputPagination,
    TRemoteParamsType
  >;

  public toOutputPagination(
    input: TRemoteDataType
  ): BreadCollectionOperationOutputPagination {
    const resolver = new BreadPropertiesResolver<
      TRemoteDataType,
      BreadCollectionOperationOutputPagination
    >(this.toOutputPaginationMap);

    return resolver.resolve(input);
  }

  public toRemoteParams(
    input: BreadCollectionOperationInputPagination
  ): TRemoteParamsType {
    const resolver = new BreadPropertiesResolver<
      BreadCollectionOperationInputPagination,
      TRemoteParamsType
    >(this.toRemoteParamsMap);

    return resolver.resolve(input);
  }
}

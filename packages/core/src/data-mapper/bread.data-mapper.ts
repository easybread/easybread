import { BreadSchema } from '@easybread/schemas';

import { BreadDataMapDefinition } from './bread.data-map-definition.interface';
import { BreadPropertiesResolver } from './bread.properties-resolver';

export abstract class BreadDataMapper<
  TRemoteType extends object,
  TSchemaType extends BreadSchema
> {
  protected abstract readonly toRemoteMap: BreadDataMapDefinition<
    TSchemaType,
    TRemoteType
  >;

  protected abstract readonly toSchemaMap: BreadDataMapDefinition<
    TRemoteType,
    TSchemaType
  >;

  public toRemote(input: TSchemaType): TRemoteType {
    const resolver = new BreadPropertiesResolver<TSchemaType, TRemoteType>(
      this.toRemoteMap
    );
    return resolver.resolve(input);
  }

  public toSchema(input: TRemoteType): TSchemaType {
    const resolver = new BreadPropertiesResolver<TRemoteType, TSchemaType>(
      this.toSchemaMap
    );

    return resolver.resolve(input);
  }
}

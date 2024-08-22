import { BreadDataMapDefinition, BreadDataMapper } from '@easybread/core';
import { AddressSchema } from '@easybread/schemas';

import { GsuiteAdminAddress } from '../interfaces';

export class GsuiteAdminAddressMapper extends BreadDataMapper<
  GsuiteAdminAddress,
  AddressSchema
> {
  protected readonly toRemoteMap: BreadDataMapDefinition<
    AddressSchema,
    GsuiteAdminAddress
  > = {
    country: 'addressCountry',
    poBox: 'postOfficeBoxNumber',
    postalCode: 'postalCode',
    streetAddress: 'streetAddress',
    locality: 'addressLocality',
    region: 'addressRegion',
    type: 'name'
  };

  protected readonly toSchemaMap: BreadDataMapDefinition<
    GsuiteAdminAddress,
    AddressSchema
  > = {
    '@type': _ => 'PostalAddress',
    name: 'type',
    postOfficeBoxNumber: 'poBox',
    postalCode: 'postalCode',
    streetAddress: 'streetAddress',
    addressLocality: 'locality',
    addressRegion: 'region',
    addressCountry: 'country'
  };
}

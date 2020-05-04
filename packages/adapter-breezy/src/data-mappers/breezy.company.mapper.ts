import { BreadDataMapDefinition, BreadDataMapper } from '@easybread/core';
import { OrganizationSchema } from '@easybread/schemas';

import { BreezyCompany } from '../interfaces';

export class BreezyCompanyMapper extends BreadDataMapper<
  BreezyCompany,
  OrganizationSchema
> {
  protected readonly toRemoteMap: BreadDataMapDefinition<
    OrganizationSchema,
    BreezyCompany
  > = {
    _id: 'identifier',
    // eslint-disable-next-line @typescript-eslint/camelcase
    member_count: 'numberOfEmployees',
    initial: 'alternateName',
    name: 'name'
  };

  protected readonly toSchemaMap: BreadDataMapDefinition<
    BreezyCompany,
    OrganizationSchema
  > = {
    '@type': _ => 'Organization',
    identifier: '_id',
    name: 'name',
    alternateName: 'initial',
    numberOfEmployees: 'member_count'
  };
}

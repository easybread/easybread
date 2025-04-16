import { breadDataAdapter } from '@easybread/data-adapter';
import { NO_MAP } from '@easybread/data-mapper';
import { OrganizationSchema } from '@easybread/schemas';

import { BreezyCompany } from '../interfaces';

export const breezyCompanyAdapter = breadDataAdapter<
  OrganizationSchema,
  BreezyCompany
>({
  toInternal: {
    '@type': () => 'Organization',
    identifier: '_id',
    name: 'name',
    alternateName: 'initial',
    numberOfEmployees: 'member_count',
  },
  toExternal: {
    _id: 'identifier',
    member_count: 'numberOfEmployees',
    initial: 'alternateName',
    name: 'name',
    friendly_id: NO_MAP,
    creation_date: NO_MAP,
  },
});

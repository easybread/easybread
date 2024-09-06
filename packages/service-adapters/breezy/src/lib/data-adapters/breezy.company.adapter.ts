import { breadDataAdapter } from '@easybread/data-adapter';
import { BreezyCompany } from '../interfaces';
import { OrganizationSchema } from '@easybread/schemas';

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
  },
});

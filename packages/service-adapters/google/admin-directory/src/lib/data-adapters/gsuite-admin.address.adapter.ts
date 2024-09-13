import { AddressSchema } from '@easybread/schemas';

import { GsuiteAdminAddress } from '../interfaces';
import { breadDataAdapter } from '@easybread/data-adapter';

export const gsuiteAdminAddressAdapter = breadDataAdapter<
  AddressSchema,
  GsuiteAdminAddress
>({
  toExternal: {
    country: 'addressCountry',
    poBox: 'postOfficeBoxNumber',
    postalCode: 'postalCode',
    streetAddress: 'streetAddress',
    locality: 'addressLocality',
    region: 'addressRegion',
    type: 'name',
  },
  toInternal: {
    '@type': () => 'PostalAddress',
    name: 'type',
    postOfficeBoxNumber: 'poBox',
    postalCode: 'postalCode',
    streetAddress: 'streetAddress',
    addressLocality: 'locality',
    addressRegion: 'region',
    addressCountry: 'country',
  },
});

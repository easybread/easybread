import { AddressSchema } from '@easybread/schemas';
import { breadDataAdapter } from '@easybread/data-adapter';

import { GoogleAdminDirectoryAddress } from '../interfaces';

export const googleAdminDirectoryAddressAdapter = breadDataAdapter<
  AddressSchema,
  GoogleAdminDirectoryAddress
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

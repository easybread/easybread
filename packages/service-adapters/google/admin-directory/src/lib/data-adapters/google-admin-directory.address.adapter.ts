import { breadDataAdapter } from '@easybread/data-adapter';
import { PostalAddressSchema } from '@easybread/schemas';

import { GoogleAdminDirectoryAddress } from '../interfaces';

export const googleAdminDirectoryAddressAdapter = breadDataAdapter<
  PostalAddressSchema,
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

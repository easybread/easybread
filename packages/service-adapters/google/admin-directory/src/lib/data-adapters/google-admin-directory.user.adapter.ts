import { PersonSchema } from '@easybread/schemas';

import { GoogleAdminDirectoryUser } from '../interfaces';
import { breadDataAdapter } from '@easybread/data-adapter';
import { googleAdminDirectoryAddressAdapter } from './google-admin-directory.address.adapter';

export const googleAdminDirectoryUserAdapter = breadDataAdapter<
  PersonSchema,
  GoogleAdminDirectoryUser
>({
  toExternal: {
    id: 'identifier',
    password: 'password',
    kind: () => 'admin#directory#user',
    primaryEmail: 'email',

    name: ({ name, familyName, givenName }) => {
      if (!givenName && !familyName && !name) return undefined;

      return {
        givenName,
        familyName,
        fullName: name,
      };
    },

    phones: (input) => {
      if (!input.telephone) return [];
      return [{ value: input.telephone }];
    },

    addresses: (input) => {
      if (!input.address) return [];

      if (typeof input.address === 'string') {
        return [
          {
            type: 'home',
            formatted: input.address,
          },
        ];
      }

      return [googleAdminDirectoryAddressAdapter.toExternal(input.address)];
    },
  },
  toInternal: {
    '@type': () => 'Person',
    identifier: 'id',
    name: (input) => input.name?.fullName,
    familyName: (input) => input.name?.familyName,
    givenName: (input) => input.name?.givenName,
    email: 'primaryEmail',

    telephone: (input) => {
      if (!input.phones || input.phones.length === 0) return undefined;

      let phone = input.phones.find((p) => p.primary);

      if (!phone) phone = input.phones[0];

      return phone.value;
    },

    address: (input) => {
      if (!input.addresses || input.addresses.length === 0) return undefined;

      let address = input?.addresses?.find((a) => a.primary);

      if (!address) address = input?.addresses[0];

      if (!address.streetAddress && address.formatted) return address.formatted;

      return googleAdminDirectoryAddressAdapter.toInternal(address);
    },
  },
});

import { breadDataAdapter } from '@easybread/data-adapter';
import type { PersonSchema } from '@easybread/schemas';

import type { BreezyUser } from '../interfaces';

export const breezyUserAdapter = breadDataAdapter<PersonSchema, BreezyUser>({
  toExternal: {
    _id: 'identifier',
    email_address: 'email',
    name: _ => [_.givenName, _.familyName].filter(Boolean).join(' '),
    username: _ => _.name ?? _.email,
    initial: _ => _.givenName?.[0] ?? undefined,
    creation_date: 'createdAt',
    updated_date: 'updatedAt',
    verified_email: 'emailVerified',
  },
  toInternal: {
    '@type': () => 'Person',
    identifier: _ => _._id,
    givenName: _ => _.name?.split(' ')[0],
    familyName: _ => _.name?.split(' ')[1],
    name: 'username',
    email: 'email_address',
    emailVerified: 'verified_email',
    createdAt: 'creation_date',
    updatedAt: 'updated_date',
  },
});

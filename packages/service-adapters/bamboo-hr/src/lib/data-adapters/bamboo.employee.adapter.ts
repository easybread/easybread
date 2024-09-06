import { breadDataAdapter } from '@easybread/data-adapter';
import { PersonSchema } from '@easybread/schemas';
import { BambooEmployee } from '../interfaces';

export const bambooEmployeeAdapter = breadDataAdapter<
  PersonSchema,
  BambooEmployee
>({
  toExternal: {
    id: 'identifier',
    firstName: 'givenName',
    lastName: 'familyName',
    workEmail: 'email',
    workPhone: 'telephone',
  },
  toInternal: {
    '@type': () => 'Person',
    identifier: 'id',
    gender: (_) => _.gender ?? undefined,
    name: ({ firstName, lastName }) => {
      return firstName || lastName
        ? `${firstName} ${lastName}`.trim()
        : undefined;
    },
    givenName: (_) => _.firstName ?? undefined,
    familyName: (_) => _.lastName ?? undefined,
    jobTitle: (_) => _.jobTitle ?? undefined,
    telephone: ({ workPhone, mobilePhone }) => {
      // TODO: better handling
      const phone = workPhone || mobilePhone;
      return phone ? `${phone}` : undefined;
    },
    email: (_) => _.workEmail ?? undefined,
    image: (_) => _.photoUrl ?? undefined,
    workLocation: (_) => _.location ?? undefined,
  },
});

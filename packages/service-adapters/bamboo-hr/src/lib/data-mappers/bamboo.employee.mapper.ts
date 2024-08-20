import { BreadDataMapDefinition, BreadDataMapper } from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { BambooEmployee } from '../interfaces';

export class BambooEmployeeMapper extends BreadDataMapper<
  BambooEmployee,
  PersonSchema
> {
  protected readonly toRemoteMap: BreadDataMapDefinition<
    PersonSchema,
    BambooEmployee
  > = {
    id: 'identifier',
    firstName: 'givenName',
    lastName: 'familyName',
    workEmail: 'email',
    workPhone: 'telephone',
  };

  protected readonly toSchemaMap: BreadDataMapDefinition<
    BambooEmployee,
    PersonSchema
  > = {
    '@type': () => 'Person',
    identifier: 'id',
    gender: 'gender',
    name: ({ firstName, lastName }) => {
      return firstName || lastName
        ? `${firstName} ${lastName}`.trim()
        : undefined;
    },
    givenName: 'firstName',
    familyName: 'lastName',
    jobTitle: 'jobTitle',
    telephone: ({ workPhone, mobilePhone }) => {
      // TODO: proper handling
      const phone = workPhone || mobilePhone;
      return phone ? `${phone}` : undefined;
    },
    email: 'workEmail',
    image: 'photoUrl',
    workLocation: 'location',
  };
}

import { BreadDataMapDefinition, BreadDataMapper } from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GsuiteAdminUser } from '../interfaces';

export class GsuiteAdminUserMapper extends BreadDataMapper<
  GsuiteAdminUser,
  PersonSchema
> {
  protected readonly toRemoteMap: BreadDataMapDefinition<
    PersonSchema,
    GsuiteAdminUser
  > = {
    id: 'identifier',
    password: 'password',
    kind: () => 'admin#directory#user',
    primaryEmail: 'email',
    name: ({ name, familyName, givenName }) => {
      if (!givenName && !familyName && !name) return undefined;
      return {
        givenName,
        familyName,
        fullName: name
      };
    }
  };

  protected readonly toSchemaMap: BreadDataMapDefinition<
    GsuiteAdminUser,
    PersonSchema
  > = {
    '@type': () => 'Person',
    identifier: 'id',
    name: input => input.name?.fullName,
    familyName: input => input.name?.familyName,
    givenName: input => input.name?.givenName,
    email: 'primaryEmail'
  };
}

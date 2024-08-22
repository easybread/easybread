import { BreadDataMapDefinition, BreadDataMapper } from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { RocketChatUser } from '../interfaces';

export class RocketChatUserMapper extends BreadDataMapper<
  RocketChatUser,
  PersonSchema
> {
  protected readonly toRemoteMap: BreadDataMapDefinition<
    PersonSchema,
    RocketChatUser
  > = {
    _id: 'identifier',
    language: 'knowsLanguage',
    name: 'name',
    username: 'additionalName'
  };

  protected readonly toSchemaMap: BreadDataMapDefinition<
    RocketChatUser,
    PersonSchema
  > = {
    '@type': _ => 'Person',
    knowsLanguage: 'language',
    identifier: '_id',
    name: 'name',
    additionalName: 'username'
  };
}

import { Bcp47LanguageCode, PersonSchema } from '@easybread/schemas';

import { RocketChatUser } from '../interfaces';
import { breadDataAdapter } from '@easybread/data-adapter';

export const rocketChatUserAdapter = breadDataAdapter<
  PersonSchema,
  RocketChatUser
>({
  toExternal: {
    _id: 'identifier',
    language: 'knowsLanguage',
    name: 'name',
    username: 'additionalName',
    active: null,
    type: null,
  },
  toInternal: {
    '@type': () => 'Person',
    identifier: '_id',
    // TODO: implement isBcp47LanguageCode type predicate
    knowsLanguage: (_) =>
      _.language ? (_.language as Bcp47LanguageCode) : undefined,
    name: 'name',
    additionalName: 'username',
  },
});

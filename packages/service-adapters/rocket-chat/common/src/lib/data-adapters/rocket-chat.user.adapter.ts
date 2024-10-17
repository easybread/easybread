import { Bcp47LanguageCode, PersonSchema } from '@easybread/schemas';
import { breadDataAdapter } from '@easybread/data-adapter';
import { NO_MAP } from '@easybread/data-mapper';

import { RocketChatUser } from '../interfaces';

export const rocketChatUserAdapter = breadDataAdapter<
  PersonSchema,
  RocketChatUser
>({
  toExternal: {
    _id: 'identifier',
    language: 'knowsLanguage',
    name: 'name',
    username: 'additionalName',
    active: NO_MAP,
    type: NO_MAP,
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

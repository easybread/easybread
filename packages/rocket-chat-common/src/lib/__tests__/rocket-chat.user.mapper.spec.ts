import { PersonSchema } from '@easybread/schemas';

import { RocketChatUserMapper } from '../..';
import { USER_MOCK } from './user.mock';

const mapper = new RocketChatUserMapper();

describe('toRemoteMap()', () => {
  it(`should correctly map from bread schema to remote type`, async () => {
    const result = mapper.toRemote({
      '@type': 'Person',
      knowsLanguage: 'en',
      identifier: '111',
      name: 'User Name',
      additionalName: 'user.name',
    });

    expect(result).toEqual({
      _id: '111',
      language: 'en',
      name: 'User Name',
      username: 'user.name',
    });
  });
});

describe('toSchemaMap()', () => {
  it(`should correctly map from remote type to bread schema`, async () => {
    const result = mapper.toSchema(USER_MOCK);
    expect(result).toEqual({
      '@type': 'Person',
      knowsLanguage: 'en',
      identifier: '111',
      name: 'User Name',
      additionalName: 'user.name',
    } as PersonSchema);
  });
});

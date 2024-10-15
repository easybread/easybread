import { PersonSchema } from '@easybread/schemas';

import { rocketChatUserAdapter } from '../..';
import { USER_MOCK } from './user.mock';

describe('toRemoteMap()', () => {
  it(`should correctly map from bread schema to remote type`, async () => {
    const result = rocketChatUserAdapter.toExternal({
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
    const result = rocketChatUserAdapter.toInternal(USER_MOCK);
    expect(result).toEqual({
      '@type': 'Person',
      knowsLanguage: 'en',
      identifier: '111',
      name: 'User Name',
      additionalName: 'user.name',
    } satisfies PersonSchema);
  });
});

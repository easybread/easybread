import { InMemoryStateAdapter } from '@easybread/core';

import { RocketChatAuthStrategy } from '../..';

const BREAD_ID = '1';

const stateAdapter = new InMemoryStateAdapter();
const authStrategy = new RocketChatAuthStrategy(stateAdapter);

afterEach(async () => {
  await stateAdapter.reset();
});

describe('authenticate()', () => {
  it(`should set correct auth data`, async () => {
    await authStrategy.authenticate(BREAD_ID, {
      authToken: 'token',
      userId: 'user_id',
    });

    const stateData = await authStrategy.readAuthData(BREAD_ID);

    expect(stateData).toEqual({
      authToken: 'token',
      userId: 'user_id',
    });
  });
});

describe('authorizeHttp()', () => {
  it(`should set correct headers`, async () => {
    await authStrategy.authenticate(BREAD_ID, {
      authToken: 'token',
      userId: 'user_id',
    });

    const requestConfig = await authStrategy.authorizeHttp(BREAD_ID, {
      url: 'http://example.com/api',
      method: 'GET',
    });

    expect(requestConfig).toEqual({
      headers: {
        'X-Auth-Token': 'token',
        'X-User-Id': 'user_id',
      },
      method: 'GET',
      url: 'http://example.com/api',
    });
  });
});

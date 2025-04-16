import { RocketChatAuthStrategy } from '@easybread/adapter-rocket-chat-common';
import {
  EasyBreadClient,
  InMemoryStateAdapter,
  type inferCommandInput,
} from '@easybread/core';
import { mockAxios } from '@easybread/test-utils';
import axios from 'axios';

import {
  ROCKET_CHAT_USERS_COMMAND_NAME,
  RocketChatUsersAdapter,
  RocketChatUsersByIdCommand,
  RocketChatUsersSearchCommand,
} from '../..';

import { USERS_INFO_MOCK } from './users-info.mock';
import { USERS_LIST_MOCK } from './users-list.mock';

mockAxios();

const BREAD_ID = '1';
const AUTH_TOKEN = 'auth-token';
const USER_ID = 'user-id';

const stateAdapter = new InMemoryStateAdapter();
const authStrategy = new RocketChatAuthStrategy(stateAdapter);
const serviceAdapter = new RocketChatUsersAdapter(authStrategy, {
  serverUrl: 'https://testserver.io',
});

const client = new EasyBreadClient(stateAdapter, serviceAdapter);

it(`should allow creating the client`, () => {
  expect(client).toBeInstanceOf(EasyBreadClient);
});

describe('Operations', () => {
  describe('AUTH_CONFIGURE', () => {
    it(`should save auth data to state`, async () => {
      await client.invoke(ROCKET_CHAT_USERS_COMMAND_NAME.AUTH_BASIC_SET, {
        breadId: BREAD_ID,
        params: null,
        payload: {
          '@context': 'https://schema.easybread.io/auth',
          '@type': 'CredentialBasic',
          username: USER_ID,
          password: AUTH_TOKEN,
        },
      });

      expect(await authStrategy.readAuthData(BREAD_ID)).toEqual({
        authToken: AUTH_TOKEN,
        userId: USER_ID,
      });
    });
  });

  describe('SEARCH', () => {
    beforeAll(() => {
      jest.resetAllMocks();
    });

    it(`should call GET https://testserver.io/api/users.list with expected query params`, async () => {
      await invokeUsersSearch();
      expect(jest.mocked(axios.request).mock.calls).toEqual([
        [
          {
            headers: { 'X-Auth-Token': AUTH_TOKEN, 'X-User-Id': USER_ID },
            method: 'GET',
            params: { count: 20, offset: 0 },
            url: 'https://testserver.io/api/v1/users.list',
          },
        ],
      ]);
    });

    it(`should produce the correct output`, async () => {
      setupUsersListResponse();
      const output = await invokeUsersSearch();
      expect(output).toEqual({
        success: true,
        breadId: BREAD_ID,
        pagination: {
          limit: 3,
          offset: 0,
          totalCount: 3,
          type: 'OFFSET',
        },
        payload: [
          {
            '@type': 'Person',
            additionalName: 'user.one',
            identifier: 'id1',
            knowsLanguage: 'en',
            name: 'User One',
          },
          {
            '@type': 'Person',
            additionalName: 'app.giphy',
            identifier: 'id2',
            name: 'GIPHY',
          },
          {
            '@type': 'Person',
            additionalName: 'user.two',
            identifier: 'id3',
            name: 'User Two',
          },
        ],
        rawPayload: USERS_LIST_MOCK,
      } satisfies typeof output);
    });
  });

  describe('BY_ID', () => {
    beforeAll(() => {
      jest.resetAllMocks();
    });

    it(`should call GET https://testserver.io/api/users.info with expected query params`, async () => {
      await invokeUsersById({
        '@type': 'Person',
        identifier: 'id1',
      });

      expect(jest.mocked(axios.request).mock.calls).toEqual([
        [
          {
            headers: { 'X-Auth-Token': AUTH_TOKEN, 'X-User-Id': USER_ID },
            method: 'GET',
            params: { _id: 'id1' },
            url: 'https://testserver.io/api/v1/users.info',
          },
        ],
      ]);
    });

    it(`should produce correct output`, async () => {
      setupUsersInfoResponse();
      const output = await invokeUsersById({
        '@type': 'Person',
        identifier: 'id1',
      });

      expect(output).toEqual({
        success: true,
        breadId: BREAD_ID,
        payload: {
          '@type': 'Person',
          additionalName: 'user.one',
          identifier: 'id1',
          name: 'User One',
        },
        rawPayload: USERS_INFO_MOCK,
      });
    });
  });
});

//  ------------------------------------

function setupUsersListResponse(): void {
  jest.mocked(axios.request).mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: USERS_LIST_MOCK,
    }),
  );
}

const DEFAULT_PAGINATION: inferCommandInput<RocketChatUsersSearchCommand>['pagination'] =
  {
    type: 'OFFSET',
    offset: 0,
    limit: 20,
  };

async function invokeUsersSearch(
  pagination: inferCommandInput<RocketChatUsersSearchCommand>['pagination'] = DEFAULT_PAGINATION,
  params: inferCommandInput<RocketChatUsersSearchCommand>['params'] = {
    '@type': 'SearchAction',
  },
) {
  return await client.invoke(ROCKET_CHAT_USERS_COMMAND_NAME.BASIC_USER_SEARCH, {
    breadId: BREAD_ID,
    pagination,
    params,
  });
}

//  ------------------------------------

function setupUsersInfoResponse(): void {
  jest.mocked(axios.request).mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: USERS_INFO_MOCK,
    }),
  );
}

async function invokeUsersById(
  params: inferCommandInput<RocketChatUsersByIdCommand>['params'],
) {
  return await client.invoke(ROCKET_CHAT_USERS_COMMAND_NAME.BASIC_USER_BY_ID, {
    breadId: BREAD_ID,
    params,
    payload: null,
  });
}

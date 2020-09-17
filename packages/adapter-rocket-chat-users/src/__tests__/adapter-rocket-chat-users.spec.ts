import {
  BreadOperationSkipCountInputPagination,
  EasyBreadClient,
  InMemoryStateAdapter
} from '@easybread/core';
import {
  RocketChatAuthConfigureOperation,
  RocketChatAuthStrategy,
  RocketChatOperationName
} from '@easybread/rocket-chat-common';
import axiosMock from 'axios';

import {
  RocketChatUsersAdapter,
  RocketChatUsersByIdOperation,
  RocketChatUsersByIdOperationInputParams,
  RocketChatUsersOperationName,
  RocketChatUsersSearchOperation,
  RocketChatUsersSearchOperationInputParams
} from '..';
import { USERS_INFO_MOCK } from './users-info.mock';
import { USERS_LIST_MOCK } from './users-list.mock';

const BREAD_ID = '1';
const AUTH_TOKEN = 'auth-token';
const USER_ID = 'user-id';

const stateAdapter = new InMemoryStateAdapter();
const authStrategy = new RocketChatAuthStrategy(stateAdapter);
const serviceAdapter = new RocketChatUsersAdapter({
  serverUrl: 'https://testserver.io'
});

const client = new EasyBreadClient(stateAdapter, serviceAdapter, authStrategy);

it(`should allow creating the client`, () => {
  expect(client).toBeInstanceOf(EasyBreadClient);
});

describe('Operations', () => {
  describe('AUTH_CONFIGURE', () => {
    it(`should save auth data to state`, async () => {
      await client.invoke<RocketChatAuthConfigureOperation>({
        breadId: BREAD_ID,
        name: RocketChatOperationName.AUTH_CONFIGURE,
        params: { authToken: AUTH_TOKEN, userId: USER_ID }
      });

      expect(await authStrategy.readAuthData(BREAD_ID)).toEqual({
        authToken: AUTH_TOKEN,
        userId: USER_ID
      });
    });
  });

  describe('SEARCH', () => {
    beforeAll(() => {
      jest.resetAllMocks();
    });

    it(`should call GET https://testserver.io/api/users.list with expected query params`, async () => {
      await invokeUsersSearch();
      expect((axiosMock.request as jest.Mock).mock.calls).toEqual([
        [
          {
            headers: { 'X-Auth-Token': AUTH_TOKEN, 'X-User-Id': USER_ID },
            method: 'GET',
            params: { count: 20, offset: 0 },
            url: 'https://testserver.io/api/v1/users.list'
          }
        ]
      ]);
    });

    it(`should produce the correct output`, async () => {
      setupUsersListResponse();
      const output = await invokeUsersSearch();
      expect(output).toEqual({
        name: 'ROCKET_CHAT/USERS/SEARCH',
        pagination: {
          count: 3,
          skip: 0,
          totalCount: 3,
          type: 'SKIP_COUNT'
        },
        payload: [
          {
            '@type': 'Person',
            additionalName: 'user.one',
            identifier: 'id1',
            knowsLanguage: 'en',
            name: 'User One'
          },
          {
            '@type': 'Person',
            additionalName: 'app.giphy',
            identifier: 'id2',
            name: 'GIPHY'
          },
          {
            '@type': 'Person',
            additionalName: 'user.two',
            identifier: 'id3',
            knowsLanguage: '',
            name: 'User Two'
          }
        ],
        provider: 'rocket-chat/users',
        rawPayload: { success: true, data: USERS_LIST_MOCK }
      });
    });
  });

  describe('BY_ID', () => {
    beforeAll(() => {
      jest.resetAllMocks();
    });

    it(`should call GET https://testserver.io/api/users.info with expected query params`, async () => {
      await invokeUsersById({ identifier: 'id1' });
      expect((axiosMock.request as jest.Mock).mock.calls).toEqual([
        [
          {
            headers: { 'X-Auth-Token': AUTH_TOKEN, 'X-User-Id': USER_ID },
            method: 'GET',
            params: { _id: 'id1' },
            url: 'https://testserver.io/api/v1/users.info'
          }
        ]
      ]);
    });

    it(`should produce correct output`, async () => {
      setupUsersInfoResponse();
      const output = await invokeUsersById({ identifier: 'id1' });
      expect(output).toEqual({
        name: 'ROCKET_CHAT/USERS/BY_ID',
        payload: {
          '@type': 'Person',
          additionalName: 'user.one',
          identifier: 'id1',
          knowsLanguage: '',
          name: 'User One'
        },
        provider: 'rocket-chat/users',
        rawPayload: { data: USERS_INFO_MOCK, success: true }
      });
    });
  });
});

//  ------------------------------------

function setupUsersListResponse(): void {
  (axiosMock.request as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: USERS_LIST_MOCK
    })
  );
}

const DEFAULT_PAGINATION: BreadOperationSkipCountInputPagination = {
  type: 'SKIP_COUNT',
  skip: 0,
  count: 20
};
async function invokeUsersSearch(
  pagination: BreadOperationSkipCountInputPagination = DEFAULT_PAGINATION,
  params: RocketChatUsersSearchOperationInputParams = {}
): Promise<RocketChatUsersSearchOperation['output']> {
  return await client.invoke<RocketChatUsersSearchOperation>({
    name: RocketChatUsersOperationName.SEARCH,
    pagination,
    breadId: BREAD_ID,
    params
  });
}

//  ------------------------------------

function setupUsersInfoResponse(): void {
  (axiosMock.request as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: USERS_INFO_MOCK
    })
  );
}

async function invokeUsersById(
  params: RocketChatUsersByIdOperationInputParams
): Promise<RocketChatUsersByIdOperation['output']> {
  return await client.invoke<RocketChatUsersByIdOperation>({
    breadId: BREAD_ID,
    name: RocketChatUsersOperationName.BY_ID,
    params
  });
}

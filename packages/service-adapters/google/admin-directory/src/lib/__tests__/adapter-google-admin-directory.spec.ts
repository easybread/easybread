import {
  GoogleCommonAccessTokenCreateResponse,
  GoogleCommonAuthOauth2CompleteCommand,
  GoogleCommonAuthOauth2StartCommand,
  type GoogleCommonOauth2ConnectionAttemptStateData,
} from '@easybread/adapter-google-common';
import {
  EasyBreadClient,
  InMemoryStateAdapter,
  type inferCommandOutput,
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';
import {
  expectDate,
  expectFormDataValues,
  getNthMockCallMthArg,
  mockAxios,
  setExtendedTimeout,
} from '@easybread/test-utils';
import axios from 'axios';
import { merge } from 'lodash';

import {
  GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME,
  GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME,
  GoogleAdminDirectoryAdapter,
  GoogleAdminDirectoryAuthScope,
  GoogleAdminDirectoryAuthStrategy,
  GoogleAdminDirectoryUser,
  GoogleAdminDirectoryUserByIdCommand,
  GoogleAdminDirectoryUserCreateCommand,
  GoogleAdminDirectoryUserDeleteCommand,
  GoogleAdminDirectoryUserSearchCommand,
  GoogleAdminDirectoryUserUpdateCommand,
} from '../..';

import { USERS_BY_ID_MOCK } from './users-by-id.mock';
import { USERS_LIST_MOCK } from './users-list.mock';

const BREAD_ID = '1';
const CLIENT_ID = 'client-id';
const CLIENT_SECRET = 'client-secret';
const REDIRECT_URI = 'http://localhost:8080/accept-google-oauth2-code';

const AUTH_SCOPES: GoogleAdminDirectoryAuthScope[] = [
  'https://www.googleapis.com/auth/admin.directory.group',
  'https://www.googleapis.com/auth/admin.directory.group.member',
];

const ACCESS_TOKEN_CREATE_RESPONSE_DATA: GoogleCommonAccessTokenCreateResponse =
  {
    expires_in: 3920,
    refresh_token: 'refresh-token',
    access_token: 'access-token',
    scope: AUTH_SCOPES.join(' '),
    token_type: 'Bearer',
  };

const stateAdapter = new InMemoryStateAdapter();
const authStrategy = new GoogleAdminDirectoryAuthStrategy(stateAdapter, {
  redirectUri: REDIRECT_URI,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
});
const serviceAdapter = new GoogleAdminDirectoryAdapter(authStrategy);

const client = new EasyBreadClient(stateAdapter, serviceAdapter);

setExtendedTimeout();
mockAxios();

beforeEach(() => {
  jest.resetAllMocks();
});

afterAll(() => jest.resetAllMocks());

describe('Operations', () => {
  describe(GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.AUTH_OAUTH2_START, () => {
    it(`should have the authUri in raw payload`, async () => {
      expect(await invokeStartAuth()).toEqual({
        breadId: '1',
        payload: {
          '@context': 'https://schema.easybread.io/auth',
          '@type': 'StartOAuth2Response',
          authenticationUrl: expect.stringMatching(
            new RegExp(
              'https:\\/\\/accounts\\.google\\.com\\/o\\/oauth2\\/v2\\/auth' +
                '\\?client_id=client-id' +
                '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Faccept-google-oauth2-code' +
                '&response_type=code' +
                '&scope=https%3A%2F%2Fwww\\.googleapis\\.com%2Fauth%2Fadmin\\.directory\\.group\\+https%3A%2F%2Fwww\\.googleapis\\.com%2Fauth%2Fadmin\\.directory\\.group\\.member' +
                '&access_type=offline' +
                '&include_granted_scopes=true' +
                '&alt=json' +
                '&state=[^&]+' +
                '&prompt=consent' +
                '&prompt=select_account',
            ),
          ),
        },
        rawPayload: null,
        success: true,
      });
    });
  });

  describe(GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.AUTH_OAUTH2_COMPLETE, () => {
    beforeEach(async () => {
      setupAccessTokenCreateResponse();
    });

    it(`should return an unsuccessful output if the state is invalid`, async () => {
      expect(await invokeCompleteAuth('wrong-state')).toEqual({
        breadId: '1',
        success: false,
        error: {
          name: 'ServiceException',
          provider: GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME,
          message: `${GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME}: Auth attempt token mismatch for 1`,
          timestamp: expectDate,
        },
      });
    });

    it(`should call google /token api`, async () => {
      const authAttemptToken = await getAuthAttemptData();
      await invokeCompleteAuth(authAttemptToken);

      expect(axios.request).toHaveBeenCalledWith({
        url: 'https://oauth2.googleapis.com/token',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: expect.any(FormData),
      });

      expectFormDataValues(
        getNthMockCallMthArg<{ data: FormData }>(axios.request, 1, 1).data,
        {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: 'my-auth-code',
          grant_type: 'authorization_code',
          redirect_uri: REDIRECT_URI,
        },
      );
    });
  });

  describe(GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_SEARCH, () => {
    it(`should call GET https://www.googleapis.com/admin/directory/v1/users`, async () => {
      await invokeUsersSearch('searchterm');

      expect(axios.request).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://www.googleapis.com/admin/directory/v1/users',
        headers: { authorization: 'Bearer access-token' },
        params: {
          customer: 'my_customer',
          maxResults: 300,
          query: 'searchterm',
          pageToken: 'requested_page',
        },
      });
    });

    it(`should return the expected output`, async () => {
      jest.resetAllMocks();
      setupUsersSearchResponse();

      const output = await invokeUsersSearch();

      expect(output).toEqual({
        breadId: BREAD_ID,
        success: true,
        pagination: {
          type: 'CURSOR',
          cursor: 'requested_page',
          nextCursor: 'nextpagetoken',
        },
        payload: [
          {
            '@type': 'Person',
            email: 'alex@easybread.io',
            familyName: 'Cherednichenko',
            givenName: 'Alexandr',
            identifier: '114190879825460327746',
            name: 'Alexandr Cherednichenko',
          },
          {
            '@type': 'Person',
            email: 'will@easybread.io',
            familyName: 'Reiske',
            givenName: 'William',
            identifier: '109911612007633470839',
            name: 'William Reiske',
          },
        ],
        rawPayload: USERS_LIST_MOCK,
      });
    });
  });

  describe(GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_BY_ID, () => {
    it(`should call GET https://www.googleapis.com/admin/directory/v1/users`, async () => {
      await invokeUsersById('114190879825460327746');
      expect(axios.request).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://www.googleapis.com/admin/directory/v1/users/114190879825460327746',
        headers: { authorization: 'Bearer access-token' },
      });
    });

    it(`should return the expected output`, async () => {
      setupUsersByIdResponse();
      const output = await invokeUsersById('114190879825460327746');
      expect(output).toEqual({
        breadId: BREAD_ID,
        success: true,
        payload: {
          '@type': 'Person',
          address: '123 Street Address',
          email: 'alex@easybread.io',
          familyName: 'Cherednichenko',
          givenName: 'Alexandr',
          identifier: '114190879825460327746',
          name: 'Alexandr Cherednichenko',
          telephone: '12345678',
        },
        rawPayload: USERS_BY_ID_MOCK,
      });
    });
  });

  describe(GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_UPDATE, () => {
    it(`should call PUT https://www.googleapis.com/admin/directory/v1/users/userKey API`, async () => {
      await invokeUsersUpdate('114190879825460327746', {
        '@type': 'Person',
        givenName: 'updated',
      });

      expect(axios.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://www.googleapis.com/admin/directory/v1/users/114190879825460327746',
        headers: { authorization: 'Bearer access-token' },
        data: {
          addresses: [],
          phones: [],
          kind: 'admin#directory#user',
          name: { givenName: 'updated' },
        },
      });
    });

    it(`should return the correct output`, async () => {
      const updatedRawData = setupUsersUpdateResponse({
        name: { givenName: 'updated' },
      });

      const output = await invokeUsersUpdate('114190879825460327746', {
        '@type': 'Person',
        givenName: 'updated',
      });

      expect(output).toEqual({
        breadId: BREAD_ID,
        success: true,
        payload: {
          '@type': 'Person',
          address: '123 Street Address',
          email: 'alex@easybread.io',
          familyName: 'Cherednichenko',
          givenName: 'updated',
          identifier: '114190879825460327746',
          name: 'Alexandr Cherednichenko',
          telephone: '12345678',
        },
        rawPayload: updatedRawData,
      });
    });
  });

  describe(GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_CREATE, () => {
    it(`should call POST https://www.googleapis.com/admin/directory/v1/users API`, async () => {
      await invokeUsersCreate({
        '@type': 'Person',
        password: 'test-pass',
        givenName: 'Test',
        familyName: 'Test',
      });
      expect(axios.request).toHaveBeenCalledWith({
        data: {
          kind: 'admin#directory#user',
          name: { familyName: 'Test', givenName: 'Test' },
          addresses: [],
          phones: [],
          password: 'test-pass',
        },
        method: 'POST',
        url: 'https://www.googleapis.com/admin/directory/v1/users',
        headers: { authorization: 'Bearer access-token' },
      });
    });

    it(`should return correct output`, async () => {
      setupUsersCreateResponse();
      const output = await invokeUsersCreate({
        '@type': 'Person',
        password: 'test-pass',
        givenName: 'Test',
        familyName: 'Test',
      });
      expect(output).toEqual({
        success: true,
        breadId: BREAD_ID,
        payload: {
          '@type': 'Person',
          address: '123 Street Address',
          email: 'alex@easybread.io',
          familyName: 'Cherednichenko',
          givenName: 'Alexandr',
          identifier: '114190879825460327746',
          name: 'Alexandr Cherednichenko',
          telephone: '12345678',
        },
        rawPayload: USERS_BY_ID_MOCK,
      });
    });
  });

  describe(GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_DELETE, () => {
    it(`should call DELETE https://www.googleapis.com/admin/directory/v1/users/userKey`, async () => {
      const id = '114190879825460327746';
      await invokeUsersDelete(id);
      expect(axios.request).toHaveBeenCalledWith({
        headers: { authorization: 'Bearer access-token' },
        method: 'DELETE',
        url: `https://www.googleapis.com/admin/directory/v1/users/${id}`,
      });
    });

    it(`should return removed entity identifier in the payload`, async () => {
      setupUsersDeleteResponse();
      const id = '114190879825460327746';
      const output = await invokeUsersDelete(id);
      expect(output).toEqual({
        breadId: BREAD_ID,
        success: true,
        payload: null,
        rawPayload: null,
      } satisfies typeof output);
    });
  });
});

// ------------------------------------

function invokeUsersDelete(
  identifier: string,
): Promise<inferCommandOutput<GoogleAdminDirectoryUserDeleteCommand>> {
  return client.invoke(GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_DELETE, {
    breadId: BREAD_ID,
    params: { identifier, '@type': 'Person' },
    payload: null,
  });
}
function invokeUsersCreate(
  payload: PersonSchema,
): Promise<inferCommandOutput<GoogleAdminDirectoryUserCreateCommand>> {
  return client.invoke(GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_CREATE, {
    breadId: BREAD_ID,
    params: null,
    payload,
  });
}

function invokeUsersUpdate(
  id: string,
  payload: PersonSchema,
): Promise<inferCommandOutput<GoogleAdminDirectoryUserUpdateCommand>> {
  return client.invoke(GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_UPDATE, {
    breadId: BREAD_ID,
    params: { identifier: id, '@type': 'Person' },
    payload,
  });
}

function invokeUsersSearch(
  query?: string,
): Promise<inferCommandOutput<GoogleAdminDirectoryUserSearchCommand>> {
  return client.invoke(GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_SEARCH, {
    breadId: BREAD_ID,
    params: { '@type': 'SearchAction', query },
    pagination: { type: 'CURSOR', cursor: 'requested_page' },
  });
}

function invokeUsersById(
  id: string,
): Promise<inferCommandOutput<GoogleAdminDirectoryUserByIdCommand>> {
  return client.invoke(GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_BY_ID, {
    breadId: BREAD_ID,
    params: { identifier: id, '@type': 'Person' },
    payload: null,
  });
}

async function invokeStartAuth(): Promise<
  inferCommandOutput<
    GoogleCommonAuthOauth2StartCommand<GoogleAdminDirectoryAuthScope>
  >
> {
  return client.invoke(GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.AUTH_OAUTH2_START, {
    breadId: BREAD_ID,
    params: null,
    payload: {
      '@context': 'https://schema.easybread.io/auth',
      '@type': 'StartOAuth2Request',
      scope: AUTH_SCOPES,
      prompt: ['consent', 'select_account'],
    },
  });
}
async function getAuthAttemptData() {
  const data =
    await stateAdapter.read<GoogleCommonOauth2ConnectionAttemptStateData>(
      `${GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME}:auth-attempt:GoogleAdminDirectoryAuthStrategy:${BREAD_ID}`,
    );

  if (!data) throw new Error('Unexpected empty auth attempt data');

  return data.authAttemptToken;
}

async function invokeCompleteAuth(
  state: string,
): Promise<inferCommandOutput<GoogleCommonAuthOauth2CompleteCommand>> {
  return client.invoke(
    GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.AUTH_OAUTH2_COMPLETE,
    {
      breadId: BREAD_ID,
      params: null,
      payload: {
        '@context': 'https://schema.easybread.io/auth',
        '@type': 'CompleteOAuth2Request',
        code: 'my-auth-code',
        state,
      },
    },
  );
}

// ------------------------------------

function setupAccessTokenCreateResponse(): void {
  jest.mocked(axios.request).mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: ACCESS_TOKEN_CREATE_RESPONSE_DATA,
    }),
  );
}

function setupUsersSearchResponse(): void {
  jest.mocked(axios.request).mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: USERS_LIST_MOCK,
    }),
  );
}

function setupUsersByIdResponse(): void {
  jest.mocked(axios.request).mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: USERS_BY_ID_MOCK,
    }),
  );
}

function setupUsersUpdateResponse(
  update: Partial<GoogleAdminDirectoryUser>,
): GoogleAdminDirectoryUser {
  const updatedData = merge({}, USERS_BY_ID_MOCK, update);

  jest.mocked(axios.request).mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: updatedData,
    }),
  );

  return updatedData;
}

function setupUsersCreateResponse(): void {
  jest.mocked(axios.request).mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: USERS_BY_ID_MOCK,
    }),
  );
}

function setupUsersDeleteResponse(): void {
  jest.mocked(axios.request).mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: '',
    }),
  );
}

import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';
import {
  GoogleCommonAccessTokenCreateResponse,
  GoogleCommonOauth2CompleteOperation,
  GoogleCommonOauth2StartOperation,
  GoogleCommonOperationName,
} from '@easybread/adapter-google-common';
import { PersonSchema } from '@easybread/schemas';
import { mockAxios, setExtendedTimeout } from '@easybread/test-utils';
import axios from 'axios';
import { merge } from 'lodash';

import {
  GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME,
  GoogleAdminDirectoryAdapter,
  GoogleAdminDirectoryAuthScope,
  GoogleAdminDirectoryAuthStrategy,
  GoogleAdminDirectoryOperationName,
  GoogleAdminDirectoryUser,
  GoogleAdminDirectoryUsersByIdOperation,
  GoogleAdminDirectoryUsersCreateOperation,
  GoogleAdminDirectoryUsersDeleteOperation,
  GoogleAdminDirectoryUsersSearchOperation,
  GoogleAdminDirectoryUsersUpdateOperation,
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

const serviceAdapter = new GoogleAdminDirectoryAdapter();
const stateAdapter = new InMemoryStateAdapter();
const authStrategy = new GoogleAdminDirectoryAuthStrategy(stateAdapter, {
  redirectUri: REDIRECT_URI,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
});

const client = new EasyBreadClient(stateAdapter, serviceAdapter, authStrategy);

setExtendedTimeout();
mockAxios();

beforeEach(() => {
  jest.resetAllMocks();
});

afterAll(() => jest.resetAllMocks());

describe('Operations', () => {
  describe(GoogleCommonOperationName.AUTH_FLOW_START, () => {
    it(`should have the authUri in raw payload`, async () => {
      expect(await invokeStartAuth()).toEqual({
        name: 'GOOGLE_COMMON/AUTH_FLOW/START',
        provider: GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME,
        rawPayload: {
          data: {
            authUri:
              'https://accounts.google.com/o/oauth2/v2/auth' +
              '?client_id=client-id' +
              '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Faccept-google-oauth2-code' +
              '&response_type=code' +
              // eslint-disable-next-line max-len
              '&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fadmin.directory.group%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fadmin.directory.group.member' +
              '&access_type=offline' +
              '&include_granted_scopes=true' +
              '&alt=json' +
              '&prompt=consent' +
              '&prompt=select_account',
          },
          success: true,
        },
      });
    });
  });

  describe(GoogleCommonOperationName.AUTH_FLOW_COMPLETE, () => {
    beforeEach(async () => {
      setupAccessTokenCreateResponse();
    });

    it(`should call google /token api`, async () => {
      await invokeCompleteAuth();
      expect(axios.request).toHaveBeenCalledWith({
        url: 'https://oauth2.googleapis.com/token',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data:
          'client_id=client-id' +
          '&client_secret=client-secret' +
          '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Faccept-google-oauth2-code' +
          '&grant_type=authorization_code' +
          '&code=my-auth-code',
      });
    });
  });

  describe(GoogleAdminDirectoryOperationName.USERS_SEARCH, () => {
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
        name: 'GOOGLE_ADMIN_DIRECTORY/USERS/SEARCH',
        pagination: {
          next: 'nextpagetoken',
          type: 'PREV_NEXT',
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
        provider: GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME,
        rawPayload: {
          data: USERS_LIST_MOCK,
          success: true,
        },
      });
    });
  });

  describe(GoogleAdminDirectoryOperationName.USERS_BY_ID, () => {
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
        name: 'GOOGLE_ADMIN_DIRECTORY/USERS/BY_ID',
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
        provider: GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME,
        rawPayload: {
          data: USERS_BY_ID_MOCK,
          success: true,
        },
      });
    });
  });

  describe(GoogleAdminDirectoryOperationName.USERS_UPDATE, () => {
    it(`should call PUT https://www.googleapis.com/admin/directory/v1/users/userKey API`, async () => {
      await invokeUsersUpdate({
        '@type': 'Person',
        identifier: '114190879825460327746',
        givenName: 'updated',
      });

      expect(axios.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://www.googleapis.com/admin/directory/v1/users/114190879825460327746',
        headers: { authorization: 'Bearer access-token' },
        data: {
          addresses: [],
          phones: [],
          id: '114190879825460327746',
          kind: 'admin#directory#user',
          name: { givenName: 'updated' },
        },
      });
    });

    it(`should return the correct output`, async () => {
      const updatedRawData = setupUsersUpdateResponse({
        name: { givenName: 'updated' },
      });

      const output = await invokeUsersUpdate({
        '@type': 'Person',
        identifier: '114190879825460327746',
        givenName: 'updated',
      });

      expect(output).toEqual({
        name: 'GOOGLE_ADMIN_DIRECTORY/USERS/UPDATE',
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
        provider: GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME,
        rawPayload: {
          data: updatedRawData,
          success: true,
        },
      });
    });
  });

  describe(GoogleAdminDirectoryOperationName.USERS_CREATE, () => {
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
        name: 'GOOGLE_ADMIN_DIRECTORY/USERS/CREATE',
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
        provider: GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME,
        rawPayload: {
          data: USERS_BY_ID_MOCK,
          success: true,
        },
      });
    });
  });

  describe(GoogleAdminDirectoryOperationName.USERS_DELETE, () => {
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
        name: 'GOOGLE_ADMIN_DIRECTORY/USERS/DELETE',
        payload: { '@type': 'Person', identifier: id },
        provider: GOOGLE_ADMIN_DIRECTORY_PROVIDER_NAME,
        rawPayload: { success: true },
      });
    });
  });
});

// ------------------------------------

function invokeUsersDelete(
  identifier: string
): Promise<GoogleAdminDirectoryUsersDeleteOperation['output']> {
  return client.invoke<GoogleAdminDirectoryUsersDeleteOperation>({
    name: GoogleAdminDirectoryOperationName.USERS_DELETE,
    breadId: BREAD_ID,
    payload: { identifier, '@type': 'Person' },
  });
}
function invokeUsersCreate(
  payload: PersonSchema
): Promise<GoogleAdminDirectoryUsersCreateOperation['output']> {
  return client.invoke<GoogleAdminDirectoryUsersCreateOperation>({
    name: GoogleAdminDirectoryOperationName.USERS_CREATE,
    breadId: BREAD_ID,
    payload,
  });
}

function invokeUsersUpdate(
  payload: PersonSchema
): Promise<GoogleAdminDirectoryUsersUpdateOperation['output']> {
  return client.invoke<GoogleAdminDirectoryUsersUpdateOperation>({
    name: GoogleAdminDirectoryOperationName.USERS_UPDATE,
    breadId: BREAD_ID,
    payload,
  });
}

function invokeUsersSearch(
  query?: string
): Promise<GoogleAdminDirectoryUsersSearchOperation['output']> {
  return client.invoke<GoogleAdminDirectoryUsersSearchOperation>({
    name: GoogleAdminDirectoryOperationName.USERS_SEARCH,
    params: { query },
    breadId: BREAD_ID,
    pagination: { type: 'PREV_NEXT', page: 'requested_page' },
  });
}

function invokeUsersById(
  id: string
): Promise<GoogleAdminDirectoryUsersByIdOperation['output']> {
  return client.invoke<GoogleAdminDirectoryUsersByIdOperation>({
    name: GoogleAdminDirectoryOperationName.USERS_BY_ID,
    params: { identifier: id },
    breadId: BREAD_ID,
  });
}

function invokeStartAuth(): Promise<
  GoogleCommonOauth2StartOperation<GoogleAdminDirectoryAuthScope>['output']
> {
  return client.invoke<
    GoogleCommonOauth2StartOperation<GoogleAdminDirectoryAuthScope>
  >({
    name: GoogleCommonOperationName.AUTH_FLOW_START,
    breadId: BREAD_ID,
    payload: {
      scope: AUTH_SCOPES,
      prompt: ['consent', 'select_account'],
      includeGrantedScopes: true,
    },
  });
}

async function invokeCompleteAuth(): Promise<
  GoogleCommonOauth2CompleteOperation['output']
> {
  return client.invoke<GoogleCommonOauth2CompleteOperation>({
    breadId: BREAD_ID,
    name: GoogleCommonOperationName.AUTH_FLOW_COMPLETE,
    payload: { code: 'my-auth-code' },
  });
}

// ------------------------------------

function setupUsersSearchResponse(): void {
  jest.mocked(axios.request).mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: USERS_LIST_MOCK,
    })
  );
}

function setupUsersByIdResponse(): void {
  jest.mocked(axios.request).mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: USERS_BY_ID_MOCK,
    })
  );
}

function setupUsersUpdateResponse(
  update: Partial<GoogleAdminDirectoryUser>
): GoogleAdminDirectoryUser {
  const updatedData = merge({}, USERS_BY_ID_MOCK, update);

  jest.mocked(axios.request).mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: updatedData,
    })
  );

  return updatedData;
}

function setupUsersCreateResponse(): void {
  jest.mocked(axios.request).mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: USERS_BY_ID_MOCK,
    })
  );
}

function setupUsersDeleteResponse(): void {
  jest.mocked(axios.request).mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: '',
    })
  );
}

function setupAccessTokenCreateResponse(): void {
  jest.mocked(axios.request).mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: ACCESS_TOKEN_CREATE_RESPONSE_DATA,
    })
  );
}

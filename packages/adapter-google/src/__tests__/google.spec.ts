import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';
import {
  expectDate,
  mockAxios,
  setExtendedTimeout
} from '@easybread/test-utils';
import axiosMock from 'axios';

import {
  GoogleAccessTokenCreateResponse,
  GoogleAccessTokenRefreshResponse,
  GoogleAdapter,
  GoogleAuthStrategy,
  GoogleOauth2CompleteOperation,
  GoogleOauth2StartOperation,
  GoogleOauth2StateData,
  GoogleOperationName,
  GooglePeopleCreateOperation,
  GooglePeopleSearchOperation
} from '..';
import { CONTACT_FEED_ENTRY_CREATE_MOCK } from './contact-feed-entry-create.mock';
import { CONTACTS_FEED_MOCK } from './contacts-feed.mock';
import Mock = jest.Mock;

setExtendedTimeout();
mockAxios();

const USER_ID = '1';
const CLIENT_ID = 'client-id';
const CLIENT_SECRET = 'client-secret';
const REDIRECT_URI = 'http://localhost:8080/accept-google-oauth2-code';

const AUTH_SCOPES = [
  'https://www.google.com/m8/feeds/',
  'https://www.googleapis.com/auth/contacts.readonly'
];

const ACCESS_TOKEN_CREATE_RESPONSE_DATA: GoogleAccessTokenCreateResponse = {
  expires_in: 3920,
  refresh_token: 'refresh-token',
  access_token: 'access-token',
  scope: AUTH_SCOPES.join(' '),
  token_type: 'Bearer'
};

// TODO: refactor:
//       - allow running each test case independently
//       - extract common setup/utils
//       - clean-up
describe('Google Plugin', () => {
  const serviceAdapter = new GoogleAdapter();
  const stateAdapter = new InMemoryStateAdapter();
  const authStrategy = new GoogleAuthStrategy(stateAdapter, {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI
  });

  const client = new EasyBreadClient(
    stateAdapter,
    serviceAdapter,
    authStrategy
  );

  describe('Operations', () => {
    describe(GoogleOperationName.AUTH_FLOW_START, () => {
      it(`should create the auth uri`, async () => {
        const result = await client.invoke<GoogleOauth2StartOperation>({
          breadId: USER_ID,
          name: GoogleOperationName.AUTH_FLOW_START,
          payload: {
            state: 'my-state-value',
            prompt: 'none',
            loginHint: 'my hint',
            includeGrantedScopes: true,
            scope: AUTH_SCOPES
          }
        });

        expect(result).toEqual({
          provider: serviceAdapter.provider,
          name: 'GOOGLE/AUTH_FLOW/START',
          rawPayload: {
            data: {
              authUri:
                'https://accounts.google.com/o/oauth2/v2/auth?' +
                'client_id=client-id' +
                '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Faccept-google-oauth2-code' +
                '&response_type=code' +
                // eslint-disable-next-line max-len
                '&scope=https%3A%2F%2Fwww.google.com%2Fm8%2Ffeeds%2F%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcontacts.readonly' +
                '&access_type=offline' +
                '&include_granted_scopes=true' +
                '&alt=json' +
                '&login_hint=my%20hint' +
                '&state=my-state-value' +
                '&prompt=none'
            },
            success: true
          }
        });
      });
    });

    describe(GoogleOperationName.AUTH_FLOW_COMPLETE, () => {
      let errorMode = false;

      async function invokeCompleteAuth(): Promise<
        GoogleOauth2CompleteOperation['output']
      > {
        return client.invoke<GoogleOauth2CompleteOperation>({
          breadId: USER_ID,
          name: GoogleOperationName.AUTH_FLOW_COMPLETE,
          payload: { code: 'my-auth-code' }
        });
      }

      beforeEach(() => {
        jest.resetAllMocks();
        (axiosMock.request as Mock).mockImplementationOnce(() => {
          if (errorMode) {
            throw new Error('Not authorized');
          }

          return Promise.resolve({
            status: 200,
            data: ACCESS_TOKEN_CREATE_RESPONSE_DATA
          });
        });
      });

      it(`should call google /token api`, async () => {
        await invokeCompleteAuth();
        expect(axiosMock.request).toHaveBeenCalledWith({
          url: 'https://oauth2.googleapis.com/token',
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data:
            'client_id=client-id' +
            '&client_secret=client-secret' +
            '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Faccept-google-oauth2-code' +
            '&grant_type=authorization_code' +
            '&code=my-auth-code'
        });
      });

      it(`should save the oauth2 data`, async () => {
        const actual = await authStrategy.readAuthData(USER_ID);

        expect(actual).toEqual({
          accessToken: 'access-token',
          expiresAt: expectDate,
          refreshToken: 'refresh-token'
        });
      });

      it(`should throw api error if it happens`, async () => {
        errorMode = true;
        expect(await invokeCompleteAuth()).toEqual({
          provider: serviceAdapter.provider,
          name: 'GOOGLE/AUTH_FLOW/COMPLETE',
          rawPayload: {
            error: new Error('google: Not authorized'),
            success: false
          }
        });
        errorMode = false;
      });

      it(`should return success and raw payload`, async () => {
        const result = await invokeCompleteAuth();
        expect(result.rawPayload).toEqual({
          data: ACCESS_TOKEN_CREATE_RESPONSE_DATA,
          success: true
        });
      });
    });

    describe(GoogleOperationName.PEOPLE_SEARCH, () => {
      function setupContactsMock(): void {
        (axiosMock.request as Mock).mockImplementationOnce(() => {
          return Promise.resolve({
            status: 200,
            data: CONTACTS_FEED_MOCK
          });
        });
      }

      function setupRefreshTokenMock(): void {
        (axiosMock.request as Mock).mockImplementationOnce(() => {
          return Promise.resolve({
            status: 200,
            data: {
              access_token: 'new-access-token',
              expires_in: 3690,
              scope: AUTH_SCOPES.join(' '),
              token_type: 'Bearer'
            } as GoogleAccessTokenRefreshResponse
          });
        });
      }

      async function invokePeopleSearch(): Promise<
        GooglePeopleSearchOperation['output']
      > {
        return client.invoke<GooglePeopleSearchOperation>({
          breadId: USER_ID,
          name: GoogleOperationName.PEOPLE_SEARCH
        });
      }

      beforeEach(async () => {
        jest.resetAllMocks();
        setupContactsMock();
      });

      it(`should call /m8/feeds/contacts/default/full?alt=json`, async () => {
        await invokePeopleSearch();
        expect(axiosMock.request).toHaveBeenCalledWith({
          method: 'GET',
          url: 'https://www.google.com/m8/feeds/contacts/default/full',
          params: { alt: 'json' },
          headers: {
            'GData-Version': '3.0',
            accept: 'application/json',
            authorization: 'Bearer access-token'
          }
        });
      });

      it(`should return raw payload`, async () => {
        const result = await invokePeopleSearch();
        expect(result.rawPayload).toEqual({
          success: true,
          data: CONTACTS_FEED_MOCK
        });
      });

      it(`should return Person[] payload`, async () => {
        const result = await invokePeopleSearch();
        expect(result.payload).toEqual([
          {
            '@type': 'Person',
            email: 'apeeling50@gmail.com',
            familyName: 'One',
            givenName: 'Contact',
            identifier:
              'http://www.google.com/m8/feeds/contacts/testuser%40gmail.com/base/cce0f8ee06147',
            name: 'Contact One'
          },
          {
            '@type': 'Person',
            email: 'two@mail.com',
            familyName: 'Two',
            givenName: 'Contact',
            identifier:
              'http://www.google.com/m8/feeds/contacts/testuser%40gmail.com/base/f98b6c09ec5b23',
            name: 'Contact Two'
          },
          {
            '@type': 'Person',
            email: 'three@mail.com',
            familyName: 'Three',
            givenName: 'Contact',
            identifier:
              'http://www.google.com/m8/feeds/contacts/testuser%40gmail.com/base/116021795164d6c',
            name: 'Contact Three',
            worksFor: {
              '@type': 'Organization',
              name: 'Test Org'
            }
          },
          {
            '@type': 'Person',
            email: 'four@mail.ru',
            familyName: 'Four',
            givenName: 'Contact',
            identifier:
              'http://www.google.com/m8/feeds/contacts/testuser%40gmail.com/base/19779cd0cdf63d0',
            name: 'Contact Four'
          },
          {
            '@type': 'Person',
            email: 'five@mail.st',
            familyName: 'Five',
            givenName: 'Contact',
            identifier:
              'http://www.google.com/m8/feeds/contacts/testuser%40gmail.com/base/1b7734a92b42f11',
            name: 'Contact Five'
          },
          {
            '@type': 'Person',
            additionalName: 'Additional',
            email: 'six@mail.com',
            familyName: 'Six',
            givenName: 'Contact',
            identifier:
              'http://www.google.com/m8/feeds/contacts/testuser%40gmail.com/base/21a311097e1974d',
            name: 'Contact Additional Six',
            telephone: '+7 (123) 123-1212'
          }
        ]);
      });

      it(`should refresh access token if it expired`, async () => {
        // simulate expired access token
        const oauth2DataStateKey = `google:auth-data:${USER_ID}`;
        const currentAuthData = (await stateAdapter.read<GoogleOauth2StateData>(
          oauth2DataStateKey
        )) as GoogleOauth2StateData;

        currentAuthData.expiresAt = new Date().toISOString();

        await stateAdapter.write(oauth2DataStateKey, currentAuthData);

        // setup refresh token api mock
        jest.resetAllMocks();
        setupRefreshTokenMock();

        // run people search
        await invokePeopleSearch();

        expect((axiosMock.request as Mock).mock.calls.length).toBe(2);
        // check refresh uri was called
        expect((axiosMock.request as Mock).mock.calls[0]).toEqual([
          {
            data:
              'client_id=client-id' +
              '&client_secret=client-secret' +
              '&grant_type=refresh_token' +
              '&refresh_token=refresh-token',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            url: 'https://oauth2.googleapis.com/token'
          }
        ]);

        // check contacts feed uri was called with an updated access token
        expect((axiosMock.request as Mock).mock.calls[1]).toEqual([
          {
            headers: {
              'GData-Version': '3.0',
              accept: 'application/json',
              authorization: 'Bearer new-access-token'
            },
            params: { alt: 'json' },
            method: 'GET',
            url: 'https://www.google.com/m8/feeds/contacts/default/full'
          }
        ]);

        // check auth data updated
        const updatedAuthData = await stateAdapter.read<GoogleOauth2StateData>(
          oauth2DataStateKey
        );
        expect(updatedAuthData).toEqual({
          accessToken: 'new-access-token',
          refreshToken: 'refresh-token',
          expiresAt: expectDate
        });
      });

      it(`should fail if no auth data is saved for the user`, async () => {
        const authDataStateKey = `google:auth-data:${USER_ID}`;
        // cache auth data
        const authData = await stateAdapter.read<GoogleOauth2StateData>(
          authDataStateKey
        );

        // rm auth data
        await stateAdapter.reset();

        const result = await invokePeopleSearch();
        expect(JSON.parse(JSON.stringify(result.rawPayload))).toEqual({
          error: {
            message: 'google: no auth data in the state for user 1',
            originalError: {
              message: 'no auth data in the state for user 1'
            },
            provider: 'google'
          },
          success: false
        });

        // restore auth data
        await stateAdapter.write<GoogleOauth2StateData>(
          authDataStateKey,
          authData as GoogleOauth2StateData
        );
      });
    });

    describe(GoogleOperationName.PEOPLE_CREATE, () => {
      function setupCreateContactMock(): void {
        (axiosMock.request as Mock).mockImplementationOnce(() =>
          Promise.resolve({
            status: 200,
            data: CONTACT_FEED_ENTRY_CREATE_MOCK
          })
        );
      }

      async function invokePeopleCreate(): Promise<
        GooglePeopleCreateOperation['output']
      > {
        return client.invoke<GooglePeopleCreateOperation>({
          breadId: USER_ID,
          name: GoogleOperationName.PEOPLE_CREATE,
          payload: {
            '@type': 'Person',
            givenName: 'Test',
            familyName: 'Contact',
            email: 'test@mail.com',
            telephone: '+7 (965) 444 2211'
          }
        });
      }

      beforeEach(async () => {
        jest.resetAllMocks();
        setupCreateContactMock();
      });

      it(`should call POST /m8/feeds/contacts/default/full?alt=json API`, async () => {
        await invokePeopleCreate();
        expect(axiosMock.request).toHaveBeenCalledWith({
          method: 'POST',
          url: 'https://www.google.com/m8/feeds/contacts/default/full',
          params: { alt: 'json' },
          headers: {
            'GData-Version': '3.0',
            accept: 'application/json',
            authorization: 'Bearer new-access-token'
          },
          data: {
            gd$phoneNumber: [
              {
                rel: 'http://schemas.google.com/g/2005#work',
                primary: 'true',
                $t: '+7 (965) 444 2211'
              }
            ],
            gd$email: [
              {
                rel: 'http://schemas.google.com/g/2005#work',
                primary: 'true',
                address: 'test@mail.com'
              }
            ],
            gd$name: {
              gd$fullName: { $t: 'Test Contact' },
              gd$givenName: { $t: 'Test' },
              gd$familyName: { $t: 'Contact' }
            }
          }
        });
      });
    });
  });
});

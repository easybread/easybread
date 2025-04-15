import {
  GoogleCommonAccessTokenCreateResponse,
  GoogleCommonAccessTokenRefreshResponse,
  GoogleCommonAuthOauth2CompleteCommand,
  type GoogleCommonOauth2ConnectionAttemptStateData,
  GoogleCommonOauth2StateData,
} from '@easybread/adapter-google-common';
import {
  EasyBreadClient,
  InMemoryStateAdapter,
  type inferCommandOutput,
} from '@easybread/core';
import {
  expectDate,
  expectFormDataValues,
  getNthMockCallArgs,
  getNthMockCallMthArg,
  mockAxios,
  setExtendedTimeout,
} from '@easybread/test-utils';
import axios, { AxiosRequestConfig } from 'axios';

import {
  GOOGLE_CONTACTS_COMMAND_NAME,
  GOOGLE_CONTACTS_PROVIDER_NAME,
  GoogleContactsAdapter,
  GoogleContactsAuthScopes,
  GoogleContactsAuthStrategy,
  GoogleContactsUserByIdCommand,
  GoogleContactsUserCreateCommand,
  GoogleContactsUserDeleteCommand,
  GoogleContactsUserSearchCommand,
  GoogleContactsUserUpdateCommand,
} from '../..';

import { CONTACT_FEED_ENTRY_CREATE_MOCK } from './contact-feed-entry-create.mock';
import { CONTACT_FEED_ENTRY_UPDATE_MOCK } from './contact-feed-entry-update.mock';
import { CONTACT_FEED_ENTRY_MOCK } from './contact-feed-entry.mock';
import { CONTACTS_FEED_MOCK } from './contacts-feed.mock';

setExtendedTimeout();
mockAxios();

const USER_ID = '1';
const CLIENT_ID = 'client-id';
const CLIENT_SECRET = 'client-secret';
const REDIRECT_URI = 'http://localhost:8080/accept-google-oauth2-code';

const AUTH_SCOPES: GoogleContactsAuthScopes[] = [
  'https://www.google.com/m8/feeds/',
  'https://www.googleapis.com/auth/contacts.readonly',
];

const ACCESS_TOKEN_CREATE_RESPONSE_DATA: GoogleCommonAccessTokenCreateResponse =
  {
    expires_in: 3920,
    refresh_token: 'refresh-token',
    access_token: 'access-token',
    scope: AUTH_SCOPES.join(' '),
    token_type: 'Bearer',
  };

// TODO: refactor:
//       - allow running each test case independently
//       - extract common setup/utils
//       - clean-up
describe('Google Contacts Plugin', () => {
  const stateAdapter = new InMemoryStateAdapter();
  const authStrategy = new GoogleContactsAuthStrategy(stateAdapter, {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
  });
  const serviceAdapter = new GoogleContactsAdapter(authStrategy);
  const client = new EasyBreadClient(stateAdapter, serviceAdapter);

  async function getAuthAttemptData() {
    const data =
      await stateAdapter.read<GoogleCommonOauth2ConnectionAttemptStateData>(
        `${GOOGLE_CONTACTS_PROVIDER_NAME}:auth-attempt:GoogleContactsAuthStrategy:${USER_ID}`,
      );

    if (!data) throw new Error('Unexpected empty auth attempt data');

    return data;
  }

  async function invokeAuthStart() {
    return client.invoke(GOOGLE_CONTACTS_COMMAND_NAME.AUTH_OAUTH2_START, {
      breadId: USER_ID,
      params: null,
      payload: {
        '@context': 'https://schema.easybread.io/auth',
        '@type': 'StartOAuth2Request',
        loginHint: 'my hint',
        scope: AUTH_SCOPES,
      },
    });
  }

  describe('Operations', () => {
    describe(GOOGLE_CONTACTS_COMMAND_NAME.AUTH_OAUTH2_START, () => {
      it(`should create the auth uri`, async () => {
        const result = await invokeAuthStart();
        expect(result).toEqual({
          success: true,
          breadId: USER_ID,
          payload: {
            '@context': 'https://schema.easybread.io/auth',
            '@type': 'StartOAuth2Response',
            authenticationUrl: expect.stringMatching(
              new RegExp(
                'https:\\/\\/accounts\\.google\\.com\\/o\\/oauth2\\/v2\\/auth' +
                  '\\?client_id=client-id' +
                  '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Faccept-google-oauth2-code' +
                  '&response_type=code' +
                  '&scope=https%3A%2F%2Fwww\\.google\\.com%2Fm8%2Ffeeds%2F\\+https%3A%2F%2Fwww\\.googleapis\\.com%2Fauth%2Fcontacts\\.readonly' +
                  '&access_type=offline' +
                  '&include_granted_scopes=true' +
                  '&alt=json' +
                  '&state=[^&]+' +
                  '&prompt=consent' +
                  '&login_hint=my\\+hint',
              ),
            ),
          },
          rawPayload: null,
        });
      });

      it(`should store the auth attempt data`, async () => {
        const authAttemptData = await getAuthAttemptData();

        expect(authAttemptData).toEqual({
          authAttemptToken: expect.stringMatching(/[a-zA-Z0-9_-]{16}/),
        });
      });
    });

    describe(GOOGLE_CONTACTS_COMMAND_NAME.AUTH_OAUTH2_COMPLETE, () => {
      let errorMode = false;

      async function invokeCompleteAuth(
        state: string,
      ): Promise<inferCommandOutput<GoogleCommonAuthOauth2CompleteCommand>> {
        return client.invoke(
          GOOGLE_CONTACTS_COMMAND_NAME.AUTH_OAUTH2_COMPLETE,
          {
            breadId: USER_ID,
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

      beforeEach(() => {
        jest.resetAllMocks();
        jest.mocked(axios.request).mockImplementationOnce(() => {
          if (errorMode) {
            throw new Error('Not authorized');
          }

          return Promise.resolve({
            status: 200,
            data: ACCESS_TOKEN_CREATE_RESPONSE_DATA,
          });
        });
      });

      it(`should throw api error if it happens`, async () => {
        errorMode = true;

        await invokeAuthStart();
        const authAttemptData = await getAuthAttemptData();

        expect(
          await invokeCompleteAuth(authAttemptData.authAttemptToken),
        ).toEqual({
          breadId: '1',
          error: {
            message: `${GOOGLE_CONTACTS_PROVIDER_NAME}: Not authorized`,
            name: 'ServiceException',
            provider: GOOGLE_CONTACTS_PROVIDER_NAME,
            timestamp: expectDate,
          },
          success: false,
        });
        errorMode = false;
      });

      it(`should return success, payload and raw payload`, async () => {
        await invokeAuthStart();
        const authAttemptData = await getAuthAttemptData();
        const result = await invokeCompleteAuth(
          authAttemptData.authAttemptToken,
        );

        expect(result).toEqual({
          breadId: '1',
          payload: {
            '@context': 'https://schema.easybread.io/auth',
            '@type': 'CompleteOAuth2Response',
            credential: {
              '@context': 'https://schema.easybread.io/auth',
              '@type': 'CredentialOAuth2',
              accessToken: 'access-token',
              expiresIn: 3920,
              refreshToken: 'refresh-token',
              scope: [
                'https://www.google.com/m8/feeds/',
                'https://www.googleapis.com/auth/contacts.readonly',
              ],
              tokenType: 'Bearer',
            },
          },
          rawPayload: {
            access_token: 'access-token',
            expires_in: 3920,
            refresh_token: 'refresh-token',
            scope:
              'https://www.google.com/m8/feeds/ https://www.googleapis.com/auth/contacts.readonly',
            token_type: 'Bearer',
          },
          success: true,
        });
      });

      it(`should call google /token api`, async () => {
        await invokeAuthStart();
        const authAttemptData = await getAuthAttemptData();

        await invokeCompleteAuth(authAttemptData.authAttemptToken);

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

      it(`should save the oauth2 data`, async () => {
        await invokeAuthStart();
        const authAttemptData = await getAuthAttemptData();
        await invokeCompleteAuth(authAttemptData.authAttemptToken);
        const actual = await authStrategy.readAuthData(USER_ID);
        expect(actual).toEqual({
          accessToken: 'access-token',
          expiresAt: expectDate,
          refreshToken: 'refresh-token',
        });
      });
    });

    describe(GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_SEARCH, () => {
      function setupContactsMock(): void {
        jest.mocked(axios.request).mockImplementationOnce(() => {
          return Promise.resolve({
            status: 200,
            data: CONTACTS_FEED_MOCK,
          });
        });
      }

      function setupRefreshTokenMock(): void {
        jest.mocked(axios.request).mockImplementationOnce(() => {
          return Promise.resolve({
            status: 200,
            data: {
              access_token: 'new-access-token',
              expires_in: 3690,
              scope: AUTH_SCOPES.join(' '),
              token_type: 'Bearer',
            } as GoogleCommonAccessTokenRefreshResponse,
          });
        });
      }

      async function invokePeopleSearch(
        query?: string,
      ): Promise<inferCommandOutput<GoogleContactsUserSearchCommand>> {
        return client.invoke(GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_SEARCH, {
          breadId: USER_ID,
          params: { '@type': 'SearchAction', query },
          pagination: { type: 'OFFSET', offset: 0, limit: 25 },
        });
      }

      beforeEach(async () => {
        jest.resetAllMocks();
        setupContactsMock();
      });

      it(`should call /m8/feeds/contacts/default/full?alt=json`, async () => {
        await invokePeopleSearch();
        expect(axios.request).toHaveBeenCalledWith({
          method: 'GET',
          url: 'https://www.google.com/m8/feeds/contacts/default/full',
          params: {
            alt: 'json',
            'max-results': 25,
            'start-index': 1,
            q: '',
          },
          headers: {
            'GData-Version': '3.0',
            accept: 'application/json',
            authorization: 'Bearer access-token',
          },
        });
      });

      it(`should use call the api with query string if provided`, async () => {
        await invokePeopleSearch('test');
        expect(axios.request).toHaveBeenCalledWith({
          method: 'GET',
          url: 'https://www.google.com/m8/feeds/contacts/default/full',
          params: {
            alt: 'json',
            'max-results': 25,
            'start-index': 1,
            q: 'test',
          },
          headers: {
            'GData-Version': '3.0',
            accept: 'application/json',
            authorization: 'Bearer access-token',
          },
        });
      });

      it(`should return raw payload`, async () => {
        const result = await invokePeopleSearch();
        if (!result.success) throw new Error('No success');
        expect(result.rawPayload).toEqual(CONTACTS_FEED_MOCK);
      });

      it(`should return Person[] payload`, async () => {
        const result = await invokePeopleSearch();
        if (!result.success) throw new Error('No success');
        expect(result.payload).toEqual([
          {
            '@type': 'Person',
            email: 'apeeling50@gmail.com',
            familyName: 'One',
            givenName: 'Contact',
            identifier: 'cce0f8ee06147',
            name: 'Contact One',
          },
          {
            '@type': 'Person',
            email: 'two@mail.com',
            familyName: 'Two',
            givenName: 'Contact',
            identifier: 'f98b6c09ec5b23',
            name: 'Contact Two',
          },
          {
            '@type': 'Person',
            email: 'three@mail.com',
            familyName: 'Three',
            givenName: 'Contact',
            identifier: '116021795164d6c',
            name: 'Contact Three',
            worksFor: {
              '@type': 'Organization',
              name: 'Test Org',
            },
          },
          {
            '@type': 'Person',
            email: 'four@mail.ru',
            familyName: 'Four',
            givenName: 'Contact',
            identifier: '19779cd0cdf63d0',
            name: 'Contact Four',
          },
          {
            '@type': 'Person',
            email: 'five@mail.st',
            familyName: 'Five',
            givenName: 'Contact',
            identifier: '1b7734a92b42f11',
            name: 'Contact Five',
          },
          {
            '@type': 'Person',
            additionalName: 'Additional',
            email: 'six@mail.com',
            familyName: 'Six',
            givenName: 'Contact',
            identifier: '21a311097e1974d',
            name: 'Contact Additional Six',
            telephone: '+7 (123) 123-1212',
          },
        ]);
      });

      it(`should return pagination info`, async () => {
        const result = await invokePeopleSearch();
        expect(result.pagination).toEqual({
          type: 'OFFSET',
          offset: 0,
          limit: 25,
          totalCount: 374,
        });
      });

      it(`should refresh access token if it expired`, async () => {
        // simulate expired access token
        const oauth2DataStateKey = `${GOOGLE_CONTACTS_PROVIDER_NAME}:auth-data:GoogleContactsAuthStrategy:${USER_ID}`;

        const currentAuthData =
          await stateAdapter.read<GoogleCommonOauth2StateData>(
            oauth2DataStateKey,
          );

        if (!currentAuthData) throw new Error('Unexpected empty auth data');

        currentAuthData.expiresAt = new Date(Date.now() - 1000).toISOString();

        await stateAdapter.write(oauth2DataStateKey, currentAuthData);

        // setup refresh token api mock
        jest.resetAllMocks();
        setupRefreshTokenMock();

        // run people search
        await invokePeopleSearch();

        expect(jest.mocked(axios.request)).toHaveBeenCalledTimes(2);

        // check refresh uri was called
        expect(getNthMockCallArgs(axios.request, 1)).toEqual([
          {
            data: expect.any(FormData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            url: 'https://oauth2.googleapis.com/token',
          },
        ]);

        expectFormDataValues(
          getNthMockCallMthArg<{ data: FormData }>(axios.request, 1, 1).data,
          {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: 'refresh-token',
          },
        );

        // check contacts feed uri was called with an updated access token
        expect(getNthMockCallArgs(axios.request, 2)).toEqual([
          {
            headers: {
              'GData-Version': '3.0',
              accept: 'application/json',
              authorization: 'Bearer new-access-token',
            },
            params: {
              alt: 'json',
              'max-results': 25,
              'start-index': 1,
              q: '',
            },
            method: 'GET',
            url: 'https://www.google.com/m8/feeds/contacts/default/full',
          },
        ]);

        // check auth data updated
        const updatedAuthData =
          await stateAdapter.read<GoogleCommonOauth2StateData>(
            oauth2DataStateKey,
          );

        expect(updatedAuthData).toEqual({
          accessToken: 'new-access-token',
          refreshToken: 'refresh-token',
          expiresAt: expectDate,
        });
      });

      it(`should fail if no auth data is saved for the user`, async () => {
        const authDataStateKey = `${GOOGLE_CONTACTS_PROVIDER_NAME}:auth-data:GoogleContactsAuthStrategy:${USER_ID}`;

        // cache auth data
        const authData =
          await stateAdapter.read<GoogleCommonOauth2StateData>(
            authDataStateKey,
          );

        // rm auth data
        await client.unAuthenticate(USER_ID);

        const result = await invokePeopleSearch();

        if (result.success) throw new Error('Unexpected success');

        expect(JSON.parse(JSON.stringify(result))).toEqual({
          breadId: '1',
          success: false,
          error: {
            message: `${GOOGLE_CONTACTS_PROVIDER_NAME}: no auth data in the state for 1`,
            name: 'ServiceException',
            provider: GOOGLE_CONTACTS_PROVIDER_NAME,
            timestamp: expectDate,
          },
        });

        // restore auth data
        await stateAdapter.write<GoogleCommonOauth2StateData>(
          authDataStateKey,
          authData as GoogleCommonOauth2StateData,
        );
      });
    });

    describe(GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_CREATE, () => {
      function setupCreateContactMock(): void {
        jest.mocked(axios.request).mockImplementationOnce(() =>
          Promise.resolve({
            status: 200,
            data: CONTACT_FEED_ENTRY_CREATE_MOCK,
          }),
        );
      }

      async function invokePeopleCreate(): Promise<
        inferCommandOutput<GoogleContactsUserCreateCommand>
      > {
        return client.invoke(GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_CREATE, {
          breadId: USER_ID,
          params: null,
          payload: {
            '@type': 'Person',
            givenName: 'Test',
            familyName: 'Contact',
            email: 'test@mail.com',
            telephone: '+7 (965) 444 2211',
          },
        });
      }

      beforeEach(async () => {
        jest.resetAllMocks();
        setupCreateContactMock();
      });

      it(`should call POST /m8/feeds/contacts/default/full?alt=json API`, async () => {
        await invokePeopleCreate();
        expect(axios.request).toHaveBeenCalledWith({
          method: 'POST',
          url: 'https://www.google.com/m8/feeds/contacts/default/full',
          params: { alt: 'json' },
          headers: {
            'GData-Version': '3.0',
            accept: 'application/json',
            authorization: 'Bearer new-access-token',
          },
          data: {
            gd$phoneNumber: [
              {
                rel: 'http://schemas.google.com/g/2005#work',
                primary: 'true',
                $t: '+7 (965) 444 2211',
              },
            ],
            gd$email: [
              {
                rel: 'http://schemas.google.com/g/2005#work',
                primary: 'true',
                address: 'test@mail.com',
              },
            ],
            gd$name: {
              gd$fullName: { $t: 'Test Contact' },
              gd$givenName: { $t: 'Test' },
              gd$familyName: { $t: 'Contact' },
            },
          },
        });
      });
    });

    describe(`${GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_UPDATE}`, () => {
      function setupUpdateContactMock(): void {
        jest
          .mocked(axios.request)
          .mockImplementation((config: AxiosRequestConfig) =>
            Promise.resolve({
              status: 200,
              data:
                config.method === 'GET'
                  ? CONTACT_FEED_ENTRY_MOCK
                  : CONTACT_FEED_ENTRY_UPDATE_MOCK,
            }),
          );
      }

      async function invokePeopleUpdate(): Promise<
        inferCommandOutput<GoogleContactsUserUpdateCommand>
      > {
        return client.invoke(GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_UPDATE, {
          breadId: USER_ID,
          params: { '@type': 'Person', identifier: '79ec2071883179b9' },
          payload: {
            '@type': 'Person',
            givenName: 'UpdatedFName',
            familyName: 'UpdatedSName',
            email: 'updated@mail.com',
            telephone: '+7 (965) 444 2222',
          },
        });
      }

      beforeEach(async () => {
        jest.resetAllMocks();
        setupUpdateContactMock();
      });

      afterAll(() => {
        jest.resetAllMocks();
      });

      it(`should call /m8/feeds/contacts/default/full?alt=json API 2 times - to get and update the entry`, async () => {
        await invokePeopleUpdate();
        expect(jest.mocked(axios.request).mock.calls).toEqual([
          [
            {
              headers: {
                'GData-Version': '3.0',
                accept: 'application/json',
                authorization: 'Bearer new-access-token',
              },
              method: 'GET',
              params: {
                alt: 'json',
              },
              url: 'https://www.google.com/m8/feeds/contacts/default/full/79ec2071883179b9',
            },
          ],
          [
            {
              data: {
                app$edited: {
                  $t: '2020-04-19T15:41:56.731Z',
                  xmlns$app: 'http://www.w3.org/2007/app',
                },
                category: [
                  {
                    scheme: 'http://schemas.google.com/g/2005#kind',
                    term: 'http://schemas.google.com/contact/2008#contact',
                  },
                ],
                gd$email: [
                  {
                    address: 'updated@mail.com',
                    primary: 'true',
                    rel: 'http://schemas.google.com/g/2005#work',
                  },
                ],
                gd$etag: '"R3k4eTVSLyt7I2A9XB5UE0wKTgU."',
                gd$name: {
                  gd$familyName: {
                    $t: 'UpdatedSName',
                  },
                  gd$fullName: {
                    $t: 'UpdatedFName UpdatedSName',
                  },
                  gd$givenName: {
                    $t: 'UpdatedFName',
                  },
                },
                gd$phoneNumber: [
                  {
                    $t: '+7 (965) 444 2222',
                    primary: 'true',
                    rel: 'http://schemas.google.com/g/2005#home',
                  },
                ],
                id: {
                  $t: 'http://www.google.com/m8/feeds/contacts/testuser%40mail.com/base/79ec2071883179b9',
                },
                link: [
                  {
                    href: 'https://www.google.com/m8/feeds/photos/media/testuser%40mail.com/79ec2071883179b9',
                    rel: 'http://schemas.google.com/contacts/2008/rel#photo',
                    type: 'image/*',
                  },
                  {
                    href: 'https://www.google.com/m8/feeds/contacts/testuser%40mail.com/full/79ec2071883179b9',
                    rel: 'self',
                    type: 'application/atom+xml',
                  },
                  {
                    href: 'https://www.google.com/m8/feeds/contacts/testuser%40mail.com/full/79ec2071883179b9',
                    rel: 'edit',
                    type: 'application/atom+xml',
                  },
                ],
                title: {
                  $t: 'Test Contact',
                },
                updated: {
                  $t: '2020-04-19T15:41:56.731Z',
                },
                xmlns: 'http://www.w3.org/2005/Atom',
                xmlns$batch: 'http://schemas.google.com/gdata/batch',
                xmlns$gContact: 'http://schemas.google.com/contact/2008',
                xmlns$gd: 'http://schemas.google.com/g/2005',
              },
              headers: {
                'Content-Type': 'application/json',
                'GData-Version': '3.0',
                'If-Match': '"R3k4eTVSLyt7I2A9XB5UE0wKTgU."',
                accept: 'application/json',
                authorization: 'Bearer new-access-token',
              },
              method: 'PUT',
              params: {
                alt: 'json',
              },
              url: 'https://www.google.com/m8/feeds/contacts/default/full/79ec2071883179b9',
            },
          ],
        ]);
      });

      it(`should return an updated entity`, async () => {
        const result = await invokePeopleUpdate();
        expect(result).toEqual({
          success: true,
          breadId: '1',
          payload: {
            '@type': 'Person',
            email: 'updated@mail.com',
            familyName: 'UpdatedSName',
            givenName: 'UpdatedFName',
            identifier: '79ec2071883179b9',
            name: 'UpdatedFName UpdatedSName',
            telephone: '+7 (965) 444 2222',
          },
          rawPayload: CONTACT_FEED_ENTRY_UPDATE_MOCK,
        });
      });
    });

    describe(`${GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_BY_ID}`, () => {
      function setupGetContactMock(): void {
        jest.mocked(axios.request).mockImplementationOnce(() =>
          Promise.resolve({
            status: 200,
            data: CONTACT_FEED_ENTRY_MOCK,
          }),
        );
      }

      async function invokePeopleById(): Promise<
        inferCommandOutput<GoogleContactsUserByIdCommand>
      > {
        return client.invoke(GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_BY_ID, {
          breadId: USER_ID,
          params: { '@type': 'Person', identifier: '79ec2071883179b9' },
          payload: null,
        });
      }

      beforeEach(() => {
        jest.resetAllMocks();
        setupGetContactMock();
      });
      afterAll(() => {
        jest.resetAllMocks();
      });

      it(`should call google api with correct params`, async () => {
        await invokePeopleById();
        expect(axios.request).toHaveBeenCalledWith({
          headers: {
            'GData-Version': '3.0',
            accept: 'application/json',
            authorization: 'Bearer new-access-token',
          },
          method: 'GET',
          params: { alt: 'json' },
          url: 'https://www.google.com/m8/feeds/contacts/default/full/79ec2071883179b9',
        });
      });

      it(`should return correct output`, async () => {
        const result = await invokePeopleById();
        expect(result).toEqual({
          success: true,
          breadId: '1',
          payload: {
            '@type': 'Person',
            email: 'test@mail.com',
            familyName: 'Contact',
            givenName: 'Test',
            identifier: '79ec2071883179b9',
            name: 'Test Contact',
            telephone: '+7 (965) 444 2211',
          },
          rawPayload: CONTACT_FEED_ENTRY_MOCK,
        });
      });
    });

    describe(`${GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_DELETE}`, () => {
      function setupGetContactMock(): void {
        jest
          .mocked(axios.request)
          .mockImplementation((config: AxiosRequestConfig) => {
            return config.method === 'GET'
              ? Promise.resolve({ status: 200, data: CONTACT_FEED_ENTRY_MOCK })
              : Promise.resolve({ status: 200 });
          });
      }

      async function invokePeopleDelete(): Promise<
        inferCommandOutput<GoogleContactsUserDeleteCommand>
      > {
        return client.invoke(GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_DELETE, {
          breadId: USER_ID,
          params: {
            '@type': 'Person',
            identifier: '79ec2071883179b9',
          },
          payload: null,
        });
      }

      beforeEach(() => {
        jest.resetAllMocks();
        setupGetContactMock();
      });

      afterAll(() => {
        jest.resetAllMocks();
      });

      it(`should call contact api 2 times: to fetch and then delete the entity`, async () => {
        await invokePeopleDelete();
        expect(jest.mocked(axios.request).mock.calls).toEqual([
          [
            {
              headers: {
                'GData-Version': '3.0',
                accept: 'application/json',
                authorization: 'Bearer new-access-token',
              },
              method: 'GET',
              params: {
                alt: 'json',
              },
              url: 'https://www.google.com/m8/feeds/contacts/default/full/79ec2071883179b9',
            },
          ],
          [
            {
              headers: {
                'Content-Type': 'application/json',
                'GData-Version': '3.0',
                'If-Match': '"R3k4eTVSLyt7I2A9XB5UE0wKTgU."',
                accept: 'application/json',
                authorization: 'Bearer new-access-token',
              },
              method: 'DELETE',
              params: {
                alt: 'json',
              },
              url: 'https://www.google.com/m8/feeds/contacts/default/full/79ec2071883179b9',
            },
          ],
        ]);
      });

      it(`should return a Person with identifier field`, async () => {
        const result = await invokePeopleDelete();
        expect(result).toEqual({
          success: true,
          breadId: '1',
          payload: {
            '@type': 'Person',
            email: 'test@mail.com',
            familyName: 'Contact',
            givenName: 'Test',
            identifier: '79ec2071883179b9',
            name: 'Test Contact',
            telephone: '+7 (965) 444 2211',
          },
          rawPayload: CONTACT_FEED_ENTRY_MOCK,
        });
      });
    });
  });
});

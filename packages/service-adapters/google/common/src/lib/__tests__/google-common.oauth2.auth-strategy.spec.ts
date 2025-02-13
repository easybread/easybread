import {
  AuthAttemptTokenMismatchException,
  InMemoryStateAdapter,
  NoAuthDataException,
} from '@easybread/core';
import {
  expectDate,
  expectFormDataValues,
  getNthMockCallMthArg,
  mockAxios,
  setExtendedTimeout,
} from '@easybread/test-utils';
import axios from 'axios';

import {
  GoogleCommonAccessTokenCreateResponse,
  GoogleCommonAccessTokenRefreshResponse,
  GoogleCommonOauth2AuthStrategy,
} from '../..';
import type { GoogleCommonOauth2ConnectionAttemptStateData } from '../interfaces/google-common.oauth2-connection-attempt.state-data.interface';

type TestScopes =
  | 'https://www.google.com/m8/feeds/'
  | 'https://www.googleapis.com/auth/contacts.readonly';

const PROVIDER_NAME = 'TEST_PROVIDER';
const CLIENT_ID = 'TEST_ID';
const CLIENT_SECRET = 'TEST_SECRET';
const REDIRECT_URI = 'http://localhost:8080/accept-oauth';
const BREAD_ID = '123';

const AUTH_SCOPES: TestScopes[] = [
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

const REFRESH_TOKEN_RESPONSE_DATA: GoogleCommonAccessTokenRefreshResponse = {
  access_token: 'new-access-token',
  expires_in: 3690,
  scope: AUTH_SCOPES.join(' '),
  token_type: 'Bearer',
};

const stateAdapter = new InMemoryStateAdapter();
const authStrategy = new GoogleCommonOauth2AuthStrategy<TestScopes>(
  stateAdapter,
  PROVIDER_NAME,
  {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
  },
);

setExtendedTimeout();
mockAxios();

beforeEach(async () => {
  await stateAdapter.reset();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('createAuthUri()', () => {
  it(`should create correct uri`, async () => {
    const actual = await authStrategy.createAuthUri(BREAD_ID, {
      includeGrantedScopes: true,
      loginHint: 'hint',
      prompt: ['consent'],
      scope: [
        'https://www.google.com/m8/feeds/',
        'https://www.googleapis.com/auth/contacts.readonly',
      ],
    });

    expect(actual).toEqual(
      // re = /saa%2&=+/
      expect.stringMatching(
        new RegExp(
          'https:\\/\\/accounts\\.google\\.com\\/o\\/oauth2\\/v2\\/auth' +
            '\\?client_id=TEST_ID' +
            '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Faccept-oauth' +
            '&response_type=code' +
            '&scope=https%3A%2F%2Fwww\\.google\\.com%2Fm8%2Ffeeds%2F\\+https%3A%2F%2Fwww\\.googleapis\\.com%2Fauth%2Fcontacts\\.readonly' +
            '&access_type=offline' +
            '&include_granted_scopes=true' +
            '&alt=json' +
            '&state=[^&]+' +
            '&login_hint=hint' +
            '&prompt=consent',
        ),
      ),
    );
  });
});

describe('authenticate()', () => {
  let authAttemptToken: string;

  beforeEach(async () => {
    jest.resetAllMocks();
    authAttemptToken = await createAuthUrlAndGetAuthAttemptToken();
    setupAccessTokenResponseMock();
  });

  it(`should throw if the state is invalid`, async () => {
    await expect(
      authStrategy.authenticate(BREAD_ID, { code: 'testcode', state: 'wrong' }),
    ).rejects.toThrow(AuthAttemptTokenMismatchException);
  });

  it(`should send correct http request`, async () => {
    await authStrategy.authenticate(BREAD_ID, {
      code: 'testcode',
      state: authAttemptToken,
    });

    expect(axios.request).toHaveBeenCalledWith({
      data: expect.any(FormData),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      url: 'https://oauth2.googleapis.com/token',
    });

    expectFormDataValues(
      getNthMockCallMthArg<{ data: FormData }>(axios.request, 1, 1).data,
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
        code: 'testcode',
      },
    );
  });

  it('should return correct data', async () => {
    const actual = await authStrategy.authenticate(BREAD_ID, {
      code: 'testcode',
      state: authAttemptToken,
    });

    expect(actual).toEqual({
      access_token: 'access-token',
      expires_in: 3920,
      refresh_token: 'refresh-token',
      scope:
        'https://www.google.com/m8/feeds/ https://www.googleapis.com/auth/contacts.readonly',
      token_type: 'Bearer',
    });
  });
});

describe(`readAuthData()`, () => {
  it(`should throw if not authenticated`, async () => {
    await expect(authStrategy.readAuthData(BREAD_ID)).rejects.toThrow(
      NoAuthDataException,
    );
  });

  it(`should return the auth data, if authenticated`, async () => {
    const authAttemptToken = await createAuthUrlAndGetAuthAttemptToken();
    setupAccessTokenResponseMock();

    await authStrategy.authenticate(BREAD_ID, {
      code: 'testcode',
      state: authAttemptToken,
    });

    expect(await authStrategy.readAuthData(BREAD_ID)).toEqual({
      accessToken: 'access-token',
      expiresAt: expectDate,
      refreshToken: 'refresh-token',
    });
  });
});

describe(`authorizeHttp()`, () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    setupAccessTokenResponseMock();
    await authStrategy.authenticate(BREAD_ID, {
      code: 'testcode',
      state: await createAuthUrlAndGetAuthAttemptToken(),
    });
  });

  it(`should set correct auth headers to the request config`, async () => {
    const actual = await authStrategy.authorizeHttp(BREAD_ID, {
      url: 'http://test.com',
      method: 'POST',
    });

    expect(actual).toEqual({
      headers: { authorization: 'Bearer access-token' },
      method: 'POST',
      url: 'http://test.com',
    });
  });
});

describe('refreshToken()', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    setupAccessTokenResponseMock();
    await authStrategy.authenticate(BREAD_ID, {
      code: 'testcode',
      state: await createAuthUrlAndGetAuthAttemptToken(),
    });
  });

  it(`should send the correct http request`, async () => {
    jest.resetAllMocks();
    setupRefreshTokenMock();
    await authStrategy.refreshToken(BREAD_ID);

    expect(axios.request).toHaveBeenCalledWith({
      data: expect.any(FormData),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      url: 'https://oauth2.googleapis.com/token',
    });

    expectFormDataValues(
      getNthMockCallMthArg<{ data: FormData }>(axios.request, 1, 1).data,
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: 'refresh-token',
      },
    );
  });
});

//  ------------------------------------

function setupAccessTokenResponseMock(): void {
  jest.mocked(axios.request).mockImplementationOnce(() => {
    return Promise.resolve({
      status: 200,
      data: ACCESS_TOKEN_CREATE_RESPONSE_DATA,
    });
  });
}

function setupRefreshTokenMock(): void {
  jest.mocked(axios.request).mockImplementationOnce(() => {
    return Promise.resolve({
      status: 200,
      data: REFRESH_TOKEN_RESPONSE_DATA,
    });
  });
}

async function createAuthUrlAndGetAuthAttemptToken() {
  await authStrategy.createAuthUri(BREAD_ID, {
    includeGrantedScopes: true,
    loginHint: 'hint',
    prompt: ['consent'],
    scope: [
      'https://www.google.com/m8/feeds/',
      'https://www.googleapis.com/auth/contacts.readonly',
    ],
  });

  const authAttemptData =
    await stateAdapter.read<GoogleCommonOauth2ConnectionAttemptStateData>(
      `${PROVIDER_NAME}:auth-attempt:GoogleCommonOauth2AuthStrategy:${BREAD_ID}`,
    );

  if (!authAttemptData) throw new Error('Unexpected empty auth attempt data');

  return authAttemptData.authAttemptToken;
}

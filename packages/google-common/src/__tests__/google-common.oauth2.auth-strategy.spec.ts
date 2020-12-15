import { InMemoryStateAdapter } from '@easybread/core';
import {
  expectDate,
  mockAxios,
  setExtendedTimeout
} from '@easybread/test-utils';
import axiosMock from 'axios';

import { GoogleCommonOauth2AuthStrategy } from '../google-common.oauth2.auth-strategy';
import {
  GoogleCommonAccessTokenCreateResponse,
  GoogleCommonAccessTokenRefreshResponse
} from '../interfaces';
import Mock = jest.Mock;

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
  'https://www.googleapis.com/auth/contacts.readonly'
];

const ACCESS_TOKEN_CREATE_RESPONSE_DATA: GoogleCommonAccessTokenCreateResponse = {
  // eslint-disable-next-line @typescript-eslint/camelcase
  expires_in: 3920,
  // eslint-disable-next-line @typescript-eslint/camelcase
  refresh_token: 'refresh-token',
  // eslint-disable-next-line @typescript-eslint/camelcase
  access_token: 'access-token',
  scope: AUTH_SCOPES.join(' '),
  // eslint-disable-next-line @typescript-eslint/camelcase
  token_type: 'Bearer'
};

const REFRESH_TOKEN_RESPONSE_DATA: GoogleCommonAccessTokenRefreshResponse = {
  // eslint-disable-next-line @typescript-eslint/camelcase
  access_token: 'new-access-token',
  // eslint-disable-next-line @typescript-eslint/camelcase
  expires_in: 3690,
  scope: AUTH_SCOPES.join(' '),
  // eslint-disable-next-line @typescript-eslint/camelcase
  token_type: 'Bearer'
};

const stateAdapter = new InMemoryStateAdapter();
const authStrategy = new GoogleCommonOauth2AuthStrategy<TestScopes>(
  stateAdapter,
  PROVIDER_NAME,
  {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI
  }
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
        'https://www.googleapis.com/auth/contacts.readonly'
      ],
      state: 'teststate=testvalue'
    });
    expect(actual).toEqual(
      'https://accounts.google.com/o/oauth2/v2/auth?' +
        'client_id=TEST_ID' +
        '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Faccept-oauth' +
        '&response_type=code' +
        // eslint-disable-next-line max-len
        '&scope=https%3A%2F%2Fwww.google.com%2Fm8%2Ffeeds%2F%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcontacts.readonly' +
        '&access_type=offline' +
        '&include_granted_scopes=true' +
        '&alt=json' +
        '&login_hint=hint' +
        '&state=teststate%3Dtestvalue' +
        '&prompt=consent'
    );
  });
});

describe('authenticate()', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    setupAccessTokenResponseMock();
  });

  it(`should send correct http request`, async () => {
    await authStrategy.authenticate(BREAD_ID, { code: 'testcode' });
    expect(axiosMock.request).toHaveBeenCalledWith({
      data:
        'client_id=TEST_ID' +
        '&client_secret=TEST_SECRET' +
        '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Faccept-oauth' +
        '&grant_type=authorization_code' +
        '&code=testcode',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      url: 'https://oauth2.googleapis.com/token'
    });
  });
  it('should return correct data', async () => {
    const actual = await authStrategy.authenticate(BREAD_ID, {
      code: 'testcode'
    });
    expect(actual).toEqual({
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: 'access-token',
      // eslint-disable-next-line @typescript-eslint/camelcase
      expires_in: 3920,
      // eslint-disable-next-line @typescript-eslint/camelcase
      refresh_token: 'refresh-token',
      scope:
        'https://www.google.com/m8/feeds/ https://www.googleapis.com/auth/contacts.readonly',
      // eslint-disable-next-line @typescript-eslint/camelcase
      token_type: 'Bearer'
    });
  });
});

describe(`readAuthData()`, () => {
  it(`should return the auth data`, async () => {
    setupAccessTokenResponseMock();
    await authStrategy.authenticate(BREAD_ID, {
      code: 'testcode'
    });

    expect(await authStrategy.readAuthData(BREAD_ID)).toEqual({
      accessToken: 'access-token',
      expiresAt: expectDate,
      refreshToken: 'refresh-token'
    });
  });
});

describe(`authorizeHttp()`, () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    setupAccessTokenResponseMock();
    await authStrategy.authenticate(BREAD_ID, {
      code: 'testcode'
    });
  });
  it(`should set correct auth headers to the request config`, async () => {
    const actual = await authStrategy.authorizeHttp(BREAD_ID, {
      url: 'http://test.com',
      method: 'POST'
    });

    expect(actual).toEqual({
      headers: { authorization: 'Bearer access-token' },
      method: 'POST',
      url: 'http://test.com'
    });
  });
});

describe('refreshToken()', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    setupAccessTokenResponseMock();
    await authStrategy.authenticate(BREAD_ID, {
      code: 'testcode'
    });
  });

  it(`should send the correct http request`, async () => {
    jest.resetAllMocks();
    setupRefreshTokenMock();
    await authStrategy.refreshToken(BREAD_ID);
    expect(axiosMock.request).toHaveBeenCalledWith({
      data:
        'client_id=TEST_ID' +
        '&client_secret=TEST_SECRET' +
        '&grant_type=refresh_token' +
        '&refresh_token=refresh-token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      url: 'https://oauth2.googleapis.com/token'
    });
  });
});

//  ------------------------------------

function setupAccessTokenResponseMock(): void {
  (axiosMock.request as Mock).mockImplementationOnce(() => {
    return Promise.resolve({
      status: 200,
      data: ACCESS_TOKEN_CREATE_RESPONSE_DATA
    });
  });
}

function setupRefreshTokenMock(): void {
  (axiosMock.request as Mock).mockImplementationOnce(() => {
    return Promise.resolve({
      status: 200,
      data: REFRESH_TOKEN_RESPONSE_DATA
    });
  });
}
